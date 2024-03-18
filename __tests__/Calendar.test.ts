import dayjs from "dayjs";
import { calendar_v3 } from "googleapis";

import Calendar from "@/calendar";

const TEST_EVENTS: calendar_v3.Schema$Event[] = [
  {
    kind: "calendar#event",
    etag: '"1234566789"',
    id: "34780259as;dlifj",
    status: "confirmed",
    htmlLink:
      "https://www.google.com/calendar/event?eid=askldjf8232sdHRkMjk0Z2RhOGRpM2cgaXNsYW5kYWR2ZW50dXJlczAzOEBt",
    created: "2024-03-05T14:16:10.000Z",
    updated: "2024-03-05T14:16:10.752Z",
    summary: "Sasquatch",
    creator: { email: "test@test.com", self: true },
    organizer: { email: "test@test.com", self: true },
    start: {
      dateTime: "2025-03-11T09:30:00-04:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2025-03-17T10:30:00-04:00",
      timeZone: "America/New_York",
    },
    iCalUID: "6gda8di3g@google.com",
    sequence: 0,
    reminders: { useDefault: true },
    eventType: "default",
  },
  {
    kind: "calendar#event",
    etag: '"1234566789"',
    id: "34780259as;dlifj",
    status: "confirmed",
    htmlLink:
      "https://www.google.com/calendar/event?eid=askldjf8232sdHRkMjk0Z2RhOGRpM2cgaXNsYW5kYWR2ZW50dXJlczAzOEBt",
    created: "2024-03-05T14:16:10.000Z",
    updated: "2024-03-05T14:16:10.752Z",
    summary: "Yeti-pending",
    creator: { email: "test@test.com", self: true },
    organizer: { email: "test@test.com", self: true },
    start: {
      dateTime: "2025-12-30T09:30:00-04:00",
      timeZone: "America/New_York",
    },
    end: {
      dateTime: "2026-01-03T10:30:00-04:00",
      timeZone: "America/New_York",
    },
    iCalUID: "6gda8di3g@google.com",
    sequence: 0,
    reminders: { useDefault: true },
    eventType: "default",
  },
];

describe("Calendar", () => {
  it("instantiates with correct month grid", () => {
    const januaryDayJs = dayjs("2024-01-01");
    const januaryCalendar = new Calendar(januaryDayJs);
    const januaryMonthGrid = [
      [0, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, 0, 0, 0],
    ];
    expect(januaryCalendar.monthGrid).toEqual(januaryMonthGrid);

    const februaryDayJs = dayjs("2024-02-01");
    const februaryCalendar = new Calendar(februaryDayJs);
    expect(februaryCalendar.monthGrid).not.toEqual(januaryMonthGrid);
  });

  it("processes booking data correctly", () => {
    const processedBookingData = Calendar.processBookingData(TEST_EVENTS);
    const expectedData = {
      owners: {
        "2025": { "12": { "30": "Yeti-pending", "31": "Yeti-pending" } },
        "2026": { "1": { "1": "Yeti-pending", "2": "Yeti-pending" } },
      },
      renters: {
        "2025": {
          "3": {
            "11": "Sasquatch",
            "12": "Sasquatch",
            "13": "Sasquatch",
            "14": "Sasquatch",
            "15": "Sasquatch",
            "16": "Sasquatch",
          },
        },
      },
    };
    expect(processedBookingData).toEqual(expectedData);
  });
});
