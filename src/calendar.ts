import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { calendar_v3 } from "googleapis";

import {
  BookedDaysInterface,
  BookedMonthsInterface,
  BookedYearsInterface,
  BookingDataInterface,
  RawBookingDataInterface,
  ProcessedBookedDatesInterface,
} from "../types/interfaces";

require("dotenv").config();

const OWNERS = new Set([
  process.env.OWNER_1,
  process.env.OWNER_2,
  process.env.OWNER_3,
  process.env.OWNER_4,
]);

class Calendar {
  monthGrid: number[][];

  constructor(date: Dayjs) {
    this.monthGrid = this._createMonthGrid(date);
  }

  /** Creates a grid to represent days in a month when new instance is
   * instantiated.
   *  Input: Dayjs object
   *  Returns: [
   *            [0, 0, 1, 2, 3, 4, 5],
   *            [6, 7, 8, 9, 10, 11, 12],
   *            [13, 14, 15, 16, 17, 18, 19],
   *            [20, 21, 22, 23, 24, 25, 26],
   *            [27, 28, 29, 30, 0, 0, 0]
   *           ]
   */
  _createMonthGrid(date: Dayjs): number[][] {
    const numDaysInMonth = date.daysInMonth();
    const firstDayOfMonth = date.startOf("month").day();
    const offset = 1 - firstDayOfMonth;
    const daysWithPadding = [];

    //populate array with zeros for padding start of month
    for (let i = offset; i <= numDaysInMonth; i++) {
      if (i <= 0) {
        daysWithPadding.push(0);
      } else {
        daysWithPadding.push(i);
      }
    }

    const monthGrid = [];

    //create monthGrid where each week is an array with length 7
    for (let i = 0; i < daysWithPadding.length; i += 7) {
      const week = daysWithPadding.slice(i, i + 7);
      monthGrid.push(week);
    }

    const lastWeek = monthGrid[monthGrid.length - 1];

    //ensure final week in month is padded with zeros as needed
    while (lastWeek.length < 7) {
      lastWeek.push(0);
    }

    return monthGrid;
  }

  /**
   * Method to process raw booking data from Google Calendar
   * Input: [{event}, {event}, ...]
   * Returns: {owners:
   *                  {2023: {9: {2: 'Smith', 3: 'Smith', 4: 'Smith'}}},
   *             renters:
   *                  {2023: {10: {2: 'Jones', 2: 'Jones'}}}
   *             }
   *           }
   */
  static processBookingData(events: calendar_v3.Schema$Event[] | undefined) {
    const rawBookingData = this._extractBookingData(events);
    const processedBookingData =
      this._convertToProcessedBookingData(rawBookingData);
    return processedBookingData;
  }

  /** Helper function for getting year, month, and day as individual values
   *  Input: "2023-08-12"
   *  Returns: {year: 2023, month: 08, day: 12}
   */
  static _getYearMonthDay(dateString: string) {
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
  static _adjustEndDateString(dateString: string) {
    const dayOfYear = dayjs(dateString).dayOfYear();
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
  static _extractBookingData(events: calendar_v3.Schema$Event[] | undefined) {
    const bookingData = events!.map((event) => {
      console.log("event=", event);
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
        endDateString = this._adjustEndDateString(endDateString);
      }

      const renter = event.summary as string;
      const startDate = this._getYearMonthDay(startDateString);
      const endDate = this._getYearMonthDay(endDateString);

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
  static _addBookedDays(startDay: number, endDay: number, renter: string) {
    const bookedDays: BookedDaysInterface = {};
    for (let day = startDay; day < endDay; day++) {
      bookedDays[day] = renter;
    }

    return bookedDays;
  }

  /** Populates an object with booked months as keys and set of booked days 
   * as values
   *  Input:
   *  - startDay: 29
   *  - endDay: 3
   *  - startMonth: 09
   *  - endMonth: 10
   *  - finalYear: true
   *  Returns: {9: {29: Smith, 30: Smith}, 10: {1: Smith, 2: Cooper}}
   */
  static _addBookedMonths(
    startDay: number,
    endDay: number,
    startMonth: number,
    endMonth: number,
    finalYear: boolean,
    renter: string
  ) {
    const bookedMonthsData: BookedMonthsInterface = {};
    let currentMonth = startMonth;

    // add months and booked days to bookedMonthsData until current month 
    // equals end month
    while (currentMonth < endMonth) {
      // end date is 32 to account for max num of days in month
      const bookedDays = this._addBookedDays(startDay, 32, renter); 
      bookedMonthsData[currentMonth] = bookedDays;
      currentMonth++;
      startDay = 1;
    }

    // if we've reached final month and year of booking, 
    // can safely add from start day until end day
    if (currentMonth === endMonth && finalYear) {
      const bookedDays = this._addBookedDays(startDay, endDay, renter);
      bookedMonthsData[currentMonth] = bookedDays;
      return bookedMonthsData;
    } else {
      // if not finalYear, add all dates until Dec 31 inclusive
      while (currentMonth < 13) {
        const bookedDays = this._addBookedDays(startDay, 32, renter);
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
  static _addBookedYears(
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

      const booked = this._addBookedMonths(
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
   * Takes array of raw booking data and updates processedBookingData 
   * with processed data
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
   *  Returns: {owners:
   *                  {2023: {9: {2: 'Smith', 3: 'Smith', 4: 'Smith'}}},
   *             renters:
   *                  {2023: {10: {2: 'Jones', 2: 'Jones'}}}
   *             }
   *           }
   *
   */
  static _convertToProcessedBookingData(
    rawBookingData: RawBookingDataInterface[]
  ) {
    const processedBookingData: BookingDataInterface = {
      owners: {},
      renters: {},
    };

    for (let booking of rawBookingData) {
      const startDay = booking.startDate.day;
      const endDay = booking.endDate.day;
      const startMonth = booking.startDate.month;
      const endMonth = booking.endDate.month;
      const startYear = booking.startDate.year;
      const endYear = booking.endDate.year;
      const renter = booking.renter;
      const processedBookedDates: ProcessedBookedDatesInterface =
        this._addBookedYears(
          startDay,
          endDay,
          startMonth,
          endMonth,
          startYear,
          endYear,
          renter
        );

      this._updateProcessedBookingData(
        processedBookedDates,
        processedBookingData
      );
    }
    return processedBookingData;
  }

  /** Helper function to update processedBookingData
   *
   * Input: {renters: {2023: {09: {29, 30}, 10: {1, 2}}}}
   * Returns: undefined
   */
  static _updateProcessedBookingData(
    processedBookedDates: ProcessedBookedDatesInterface,
    processedBookingData: BookingDataInterface
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

export default Calendar;
