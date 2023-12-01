import { google, calendar_v3 } from "googleapis";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import { NextResponse, NextRequest } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

import {
  BookedDaysInterface,
  BookedMonthsInterface,
  BookedYearsInterface,
  BookingDataInterface,
  RawBookingDataInterface,
  ProcessedBookedDatesInterface,
} from "../../../../types/interfaces";

require("dotenv").config();

dayjs.extend(dayOfYear);

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const CREDENTIALS = JSON.parse(process.env.CALENDAR_SERVICE as string);
const CALENDAR_ID = process.env.CALENDAR_ID;
const OWNERS = new Set([
  process.env.OWNER_1,
  process.env.OWNER_2,
  process.env.OWNER_3,
  process.env.OWNER_4,
]);

/**
 *
 * API Route to fetch Google Calendar event information.
 *
 * Returns: {processedBookingData:
 *            {owners:
 *                  {2023: {9: {2: 'Smith', 3: 'Smith', 4: 'Smith'}}},
 *             renters: {}
 *             }
 *           }
 */
export async function GET(req: NextRequest, res: NextResponse) {
  //Must be logged in to access route
  const session = await getServerSession(
    req as unknown as NextApiRequest,
    {
      ...res,
      getHeader: (name: string) => res.headers?.get(name),
      setHeader: (name: string, value: string) => res.headers?.set(name, value),
    } as unknown as NextApiResponse,
    authOptions
  );

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  // This will be populated and returned
  const processedBookingData: BookingDataInterface = {
    owners: {},
    renters: {},
  };

  try {
    const googleCalendarEvents = await fetchGoogleCalendarEvents();
    const rawBookingData = extractBookingData(googleCalendarEvents);

    convertToProcessedBookingData(rawBookingData);

    return NextResponse.json({ processedBookingData }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }

  /**
   * Get timestamp of first day of current month
   * Returns ISO8601 timestamp without fraction seconds like:
   * '2020-04-02T08:02:17-05:00'
   */
  function getFirstDayOfCurrentMonth() {
    const today = dayjs();
    const month = today.get("month") + 1; //month is zero indexed
    const year = today.get("year");
    const firstOfMonth = dayjs(`${year}-${month}-01`);
    const firstOfMonthTimestamp = firstOfMonth.format();

    return firstOfMonthTimestamp;
  }

  /** Connect to and fetch Google Calendar Events beginning from current month
   *  Returns [{event}, {event}, ...]
   */
  async function fetchGoogleCalendarEvents() {
    const calendar = google.calendar({ version: "v3" });
    const startMonth = getFirstDayOfCurrentMonth();

    const auth = new google.auth.JWT(
      CREDENTIALS.client_email,
      undefined,
      CREDENTIALS.private_key,
      SCOPES
    );

    const res = await calendar.events.list({
      calendarId: CALENDAR_ID,
      auth: auth,
      timeMin: startMonth,
      maxResults: 2500,
    });

    const events = res.data.items;

    return events;
  }

  /** Helper function for getting year, month, and day as individual values
   *  Input: "2023-08-12"
   *  Returns: {year: 2023, month: 08, day: 12}
   */
  function getYearMonthDay(dateString: string) {
    const date = dateString.split("-");
    const year = +date[0];
    const month = +date[1];
    const day = +date[2];

    return { year, month, day };
  }

  /** Helper function to adjust end date string back one day when event type
   *  is all day event
   *  Input: "2023-08-12"
   *  Returns: "2023-08-11"
   */
  function adjustEndDateString(dateString: string) {
    const dayOfYear = dayjs(dateString).dayOfYear()
    const adjustedDate = dayjs(dateString).dayOfYear(dayOfYear - 1);
    
    return adjustedDate.format().split("T")[0];
  }

  /** Extract and convert relevent booking data from array of events
   * Input: [{event}, {event}, ...]
   * Returns: [
   *            {
   *             startDate: {year: 2023, month: 08, day: 12},
   *             endDate: {year: 2023, month: 08, day: 17},
   *             renter: "Smith"
   *              }, ...
   *            ]
   */
  function extractBookingData(events: calendar_v3.Schema$Event[] | undefined) {
    const bookingData = events!.map((event) => {
      console.log("event=", event)
      let startDateString;
      let endDateString;

      if (event.start!.dateTime) {
        const startTimeStamp = event.start!.dateTime;
        const endTimeStamp = event.end!.dateTime;
        startDateString = startTimeStamp!.split("T")[0];
        endDateString = endTimeStamp!.split("T")[0];
      } else {
        startDateString = event.start!.date as string;
        endDateString = event.end!.date as string;
        endDateString = adjustEndDateString(endDateString);
      }

      const renter = event.summary as string;
      const startDate = getYearMonthDay(startDateString);
      const endDate = getYearMonthDay(endDateString);

      return { startDate, endDate, renter };
    });

    return bookingData;
  }

  /** Input:
   *  -startDay: 8
   *  -endDay: 12
   * Returns an object: {8: Smith, 9: Smith, 10: Smith, 11: Cooper}
   *
   * Note: Last day not included since this is departure day (not booked)
   */
  function addBookedDays(startDay: number, endDay: number, renter: string) {
    const bookedDays: BookedDaysInterface = {};
    for (let day = startDay; day < endDay; day++) {
      bookedDays[day] = renter;
    }

    return bookedDays;
  }

  /** Populates an object with booked months as keys and set of booked days as values
   *  Input:
   *  - startDay: 29
   *  - endDay: 3
   *  - startMonth: 09
   *  - endMonth: 10
   *  - finalYear: true
   *  Returns: {9: {29: Smith, 30: Smith}, 10: {1: Smith, 2: Cooper}}
   */
  function addBookedMonths(
    startDay: number,
    endDay: number,
    startMonth: number,
    endMonth: number,
    finalYear: boolean,
    renter: string
  ) {
    const bookedMonthsData: BookedMonthsInterface = {};
    let currentMonth = startMonth;

    // add months and booked days to bookedMonthsData until current month equals end month
    while (currentMonth < endMonth) {
      const bookedDays = addBookedDays(startDay, 32, renter); // end date is 32 to account for max num of days in month
      bookedMonthsData[currentMonth] = bookedDays;
      currentMonth++;
      startDay = 1;
    }

    // if we've reached final month and year of booking, can safely add from start day until end day
    if (currentMonth === endMonth && finalYear) {
      const bookedDays = addBookedDays(startDay, endDay, renter);
      bookedMonthsData[currentMonth] = bookedDays;
      return bookedMonthsData;
    } else {
      // if not finalYear, add all dates until Dec 31 inclusive
      while (currentMonth < 13) {
        const bookedDays = addBookedDays(startDay, 32, renter);
        bookedMonthsData[currentMonth] = bookedDays;
        currentMonth++;
      }
    }

    return bookedMonthsData;
  }

  /** Input:
   *  -startDay: 27
   *  -endDay: 3
   *  -startMonth: 12
   *  -endMonth: 1
   *  -startYear: 2023
   *  -endyear: 2024
   *  -renter: "Smith"
   *
   *  Returns:
   *  {renters: {2023: {09: {29, 30}, 10: {1, 2}}}}
   *
   */
  function addBookedYears(
    startDay: number,
    endDay: number,
    startMonth: number,
    endMonth: number,
    startYear: number,
    endYear: number,
    renter: string
  ) {
    const bookedYears: BookedYearsInterface = {};
    let currentYear = startYear;
    let finalYear = false;

    while (currentYear <= endYear) {
      if (startMonth > 12) {
        startMonth = 1;
      }

      if (currentYear === endYear) {
        finalYear = true;
      }

      const booked = addBookedMonths(
        startDay,
        endDay,
        startMonth,
        endMonth,
        finalYear,
        renter
      );

      bookedYears[currentYear] = booked;
      currentYear++;
      startMonth++;
      startDay = 1;
    }

    if (OWNERS.has(renter)) {
      return { owners: bookedYears };
    } else {
      return { renters: bookedYears };
    }
  }

  /**
   * Takes array of raw booking data and updates processedBookingData with processed data
   *
   * Input:
   *    [
   *     {
   *      startDate: {year: 2023, month: 08, day: 12},
   *      endDate: {year: 2023, month: 08, day: 17},
   *      renter: "Smith"
   *       }, ...
   *     ]
   *
   *  Returns: undefined
   *
   */
  function convertToProcessedBookingData(
    rawBookingData: RawBookingDataInterface[]
  ) {
    for (let booking of rawBookingData) {
      const startDay = booking.startDate.day;
      const endDay = booking.endDate.day;
      const startMonth = booking.startDate.month;
      const endMonth = booking.endDate.month;
      const startYear = booking.startDate.year;
      const endYear = booking.endDate.year;
      const renter = booking.renter;
      const processedBookedDates: ProcessedBookedDatesInterface =
        addBookedYears(
          startDay,
          endDay,
          startMonth,
          endMonth,
          startYear,
          endYear,
          renter
        );

      updateProcessedBookingData(processedBookedDates);
    }
  }

  /** Helper function to update processedBookingData
   *
   * Input: {renters: {2023: {09: {29, 30}, 10: {1, 2}}}}
   * Returns: undefined
   */
  function updateProcessedBookingData(
    processedBookedDates: ProcessedBookedDatesInterface
  ) {
    for (let renter in processedBookedDates) {
      for (let year in processedBookedDates[
        renter as keyof BookingDataInterface
      ]) {
        if (
          year in processedBookingData[renter as keyof BookingDataInterface]!
        ) {
          for (let month in processedBookedDates[
            renter as keyof BookingDataInterface
          ]![year]) {
            if (
              month in
              processedBookingData[renter as keyof BookingDataInterface]![year]
            ) {
              for (let day in processedBookedDates[
                renter as keyof BookingDataInterface
              ]![year][month]) {
                processedBookingData[renter as keyof BookingDataInterface]![
                  year
                ][month][day] =
                  processedBookedDates[renter as keyof BookingDataInterface]![
                    year
                  ][month][day];
              }
            } else {
              processedBookingData[renter as keyof BookingDataInterface]![year][
                month
              ] =
                processedBookedDates[renter as keyof BookingDataInterface]![
                  year
                ][month];
            }
          }
        } else {
          processedBookingData[renter as keyof BookingDataInterface]![year] =
            processedBookedDates[renter as keyof BookingDataInterface]![year];
        }
      }
    }
  }
}
