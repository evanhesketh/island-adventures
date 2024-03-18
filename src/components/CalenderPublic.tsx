import { Dayjs } from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { BookingDataInterface } from "../../types/interfaces";

const DAYS_OF_WEEK = [
  ["Sunday", "Sun"],
  ["Monday", "Mon"],
  ["Tuesday", "Tue"],
  ["Wednesday", "Wed"],
  ["Thursday", "Thu"],
  ["Friday", "Fri"],
  ["Saturday", "Sat"],
];

/**
 * Presentational component for public calendar
 *
 * Props:
 * -datesBooked: Object containing booked dates and renters
 * -date: Dayjs object with date from CalendarForm
 * -monthGrid: array of arrays representing days in the month by week
 *
 * State:
 * -none
 *
 * {Calendar} -> CalendarPublic
 */
export default function CalendarPublic({
  datesBooked,
  date,
  monthGrid,
}: {
  datesBooked: BookingDataInterface;
  date: Dayjs;
  monthGrid: number[][];
}) {
  const month = date.get("month");
  const year = date.get("year");

  return (
    <>
      <div className="flex justify-center mb-2" data-testid="public-calendar">
        <div className="flex flex-col items-center mr-4 sm:mr-20">
          <div className="h-8 w-10 border border-black bg-gray-400"></div>
          <span className="text-sm sm:text-base">Booked</span>
        </div>
        <div className="flex flex-col items-center mr-4 sm:mr-20">
          <div className="h-8 w-10 border border-black bg-stripe-small"></div>
          <span className="text-sm sm:text-base">Please Inquire</span>
        </div>
        <div className="flex flex-col items-center mr-4 sm:mr-20">
          <div className="h-8 w-10 border border-black bg-white"></div>
          <span className="text-sm sm:text-base">Available</span>
        </div>
      </div>
      <div className="flex justify-center mb-10">
        <table className="table-fixed sm:w-3/4 md:w-3/4 lg:w-3/4 xl:w-3/4 w-3/4 border border-black">
          <thead>
            <tr>
              {DAYS_OF_WEEK.map((day) => (
                <th
                  key={day[0]}
                  className="p-2 border-r border-black h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 text-sm bg-white"
                >
                  <span className="xl:block lg:block hidden">{day[0]}</span>
                  <span className="xl:hidden lg:hidden block">{day[1]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthGrid.map((week, i) => (
              <tr key={i} className="text-center h-20">
                {week.map((day) => {
                  if (day > 0) {
                    if (
                      year in datesBooked.owners &&
                      month + 1 in datesBooked.owners[year] &&
                      day in datesBooked.owners[year][month + 1]
                    ) {
                      return (
                        <td
                          key={uuidv4()}
                          className="border border-black p-1 h-5 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 bg-stripe"
                        >
                          <span className="font-bold">{day}</span>
                        </td>
                      );
                    } else if (
                      year in datesBooked.renters &&
                      month + 1 in datesBooked.renters[year] &&
                      day in datesBooked.renters[year][month + 1]
                    ) {
                      return (
                        <td
                          key={uuidv4()}
                          className="border border-black p-1 h-5 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 bg-gray-400"
                        >
                          <span className="font-bold">{day}</span>
                        </td>
                      );
                    } else {
                      return (
                        <td
                          key={uuidv4()}
                          className="border border-black p-1 h-5 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 bg-white"
                        >
                          <span className="font-bold">{day}</span>
                        </td>
                      );
                    }
                  } else {
                    return (
                      <td
                        key={uuidv4()}
                        className="border border-black p-1 h-5 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10"
                      ></td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
