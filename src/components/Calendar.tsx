import { Dayjs } from "dayjs";

import CalendarPublic from "./CalenderPublic";
import CalendarPrivate from "./CalendarPrivate";
import { BookingDataInterface } from "../../types/interfaces";
import CalendarConstructor from "@/calendar";

/**
 * Logic for creating a calendar based on date in CalendarForm
 *
 * Props:
 * -datesBooked: Object containing booked dates and renters
 * -date: Dayjs object with date from CalendarForm
 * -userRole: role of current logged in user -> "admin" or "user"
 *
 * State:
 * -none
 *
 * {CalendarForm} -> Calendar -> {CalendarPublic, CalendarPrivate}
 *
 */
export default function Calendar({
  datesBooked,
  date,
  userRole,
}: {
  datesBooked: BookingDataInterface;
  date: Dayjs;
  userRole: string;
}) {
  const newCalendar = new CalendarConstructor(date);
  // const monthGrid = createMonthGrid(date);
  

  /** Creates a grid to represent days in a month
   *  Input: Dayjs object
   *  Returns: [
   *            [0, 0, 1, 2, 3, 4, 5],
   *            [6, 7, 8, 9, 10, 11, 12],
   *            [13, 14, 15, 16, 17, 18, 19],
   *            [20, 21, 22, 23, 24, 25, 26],
   *            [27, 28, 29, 30, 0, 0, 0]
   *           ]
   */
  // function createMonthGrid(date: Dayjs): number[][] {
  //   const numDaysInMonth = date.daysInMonth();
  //   const firstDayOfMonth = date.startOf("month").day();
  //   const offset = 1 - firstDayOfMonth;
  //   const daysWithPadding = [];

  //   //populate array with zeros for padding start of month
  //   for (let i = offset; i <= numDaysInMonth; i++) {
  //     if (i <= 0) {
  //       daysWithPadding.push(0);
  //     } else {
  //       daysWithPadding.push(i);
  //     }
  //   }

  //   const monthGrid = [];

  //   //create monthGrid where each week is an array with length 7
  //   for (let i = 0; i < daysWithPadding.length; i += 7) {
  //     const week = daysWithPadding.slice(i, i + 7);
  //     monthGrid.push(week);
  //   }

  //   const lastWeek = monthGrid[monthGrid.length - 1];

  //   //ensure final week in month is padded with zeros as needed
  //   while (lastWeek.length < 7) {
  //     lastWeek.push(0);
  //   }

  //   return monthGrid;
  // }

  return (
    <>
      {userRole === "user" && (
        <CalendarPublic
          datesBooked={datesBooked}
          date={date}
          monthGrid={newCalendar.monthGrid}
        />
      )}
      {(userRole === "admin" || userRole === "staff") && (
        <CalendarPrivate
          datesBooked={datesBooked}
          date={date}
          monthGrid={newCalendar.monthGrid}
        />
      )}
    </>
  );
}
