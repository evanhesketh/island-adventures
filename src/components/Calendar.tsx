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
 * -userRole: role of current logged in user -> "admin", "user" or "staff"
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
