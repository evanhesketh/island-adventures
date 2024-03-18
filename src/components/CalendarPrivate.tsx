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
 * Presentational component for private calendar
 *
 * Props:
 * -datesBooked: Object containing booked dates and renters
 * -date: Dayjs object with date from CalendarForm
 * -monthGrid: array of arrays representing days in the month by week
 *
 * State:
 * -none
 *
 * {Calendar} -> CalendarPrivate
 */
export default function CalendarPrivate({
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

  const renterDisplay = { prevRenter: "", bg: "bg-sky-300" };

  //Toggle bg color of renter info if new renter
  function toggleRenterDisplay(renter: string) {
    renterDisplay.prevRenter = renter;
    renterDisplay.bg =
      renterDisplay.bg === "bg-sky-300" ? "bg-sky-500" : "bg-sky-300";
  }

  return (
    <>
      <div className="flex justify-center mb-2" data-testid="private-calendar">
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
      <div className="flex justify-center my-4">
        <p className="text-sm sm:text-base">
          <span className="font-bold">*</span> A renter&apos;s name indicates
          booked for that night <span className="font-bold">*</span>
        </p>
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
                      const renter = datesBooked.owners[year][month + 1][day];

                      if (renterDisplay.prevRenter !== renter) {
                        toggleRenterDisplay(renter);
                      }

                      return (
                        <td
                          key={uuidv4()}
                          className="border border-black p-1 h-5 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 bg-stripe"
                        >
                          <div className="font-bold">{day}</div>
                          <div
                            className={`text-xs sm:text-sm md:text-sm lg:text-base ${renterDisplay.bg}`}
                          >
                            <span className="xl:block lg:block md:block sm:block xs:block hidden">
                              {renter}
                            </span>
                            <span className="xl:hidden lg:hidden md:hidden sm:hidden xs:hidden block">
                              {renter.slice(0, 3) + "..."}
                            </span>
                          </div>
                        </td>
                      );
                    } else if (
                      year in datesBooked.renters &&
                      month + 1 in datesBooked.renters[year] &&
                      day in datesBooked.renters[year][month + 1]
                    ) {
                      const renter = datesBooked.renters[year][month + 1][day];

                      if (renterDisplay.prevRenter !== renter) {
                        toggleRenterDisplay(renter);
                      }

                      return (
                        <td
                          key={uuidv4()}
                          className="border border-black p-1 h-5 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 bg-gray-400"
                        >
                          <div className="font-bold">{day}</div>
                          <div
                            className={`text-xs sm:text-sm md:text-sm lg:text-base ${renterDisplay.bg}`}
                          >
                            <span className="xl:block lg:block md:block sm:block xs:block hidden">
                              {renter}
                            </span>
                            <span className="xl:hidden lg:hidden md:hidden sm:hidden xs:hidden block">
                              {renter.slice(0, 3) + "..."}
                            </span>
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td
                          key={uuidv4()}
                          className="border border-black p-1 h-5 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 bg-white"
                        >
                          <div className="font-bold">{day}</div>
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
