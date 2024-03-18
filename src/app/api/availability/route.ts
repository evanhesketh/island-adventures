import { google } from "googleapis";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import { NextResponse, NextRequest } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

import Calendar from '../../../calendar';

require("dotenv").config();

dayjs.extend(dayOfYear);

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const CREDENTIALS = JSON.parse(process.env.CALENDAR_SERVICE as string);
const CALENDAR_ID = process.env.CALENDAR_ID;

/**
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
  // Must be logged in to access route
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

  // If logged in, retrieve Google Calendar events and process data
  try {
    const googleCalendarEvents = await fetchGoogleCalendarEvents();
    const processedBookingData = Calendar.processBookingData(googleCalendarEvents);

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
}
