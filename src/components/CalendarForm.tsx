"use client";

import dayjs from "dayjs";
import { useState, useEffect, ChangeEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";

import { BookingDataInterface } from "../../types/interfaces";
import Footer from "@/components/Footer";
import Calendar from "./Calendar";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURR_YEAR = dayjs().get("year");

/** Dynamic Calendar component with drop down form
 *
 * Props:
 *  - datesBooked: {
 *                  owners:
 *                        {
 *                          2023:
 *                                {
 *                                   8: {2, 3, 4, 5, 29, 30},
 *                                   9: {4, 5, 6,}
 *                                },
 *                          2024:
 *                              {1: {1, 2, 3}, ...}
 *                          }
 *                    renters:
 *                            {
 *                              2023:
 *                                    {
 *                                       7: {1, 2, 3, 4, 5}
 *                                    }
 *                             }
 *                  }
 *
 * State:
 *  - date: dayjs object
 *  - formData: {month: 08, year: 2023}
 *
 * {Availability} -> CalendarForm -> {Calendar}
 */
export default function CalendarForm({
  datesBooked,
}: {
  datesBooked: BookingDataInterface;
}) {
  const [date, setDate] = useState(dayjs());
  const [formData, setFormData] = useState({
    month: date.get("month"),
    year: date.get("year"),
  });
  
  const { data: session, status } = useSession();

  const yearsForDropdown = generateYears(CURR_YEAR);
 
  useEffect(
    function updateDate() {
      const month = formData.month + 1; // formData.month is 0 indexed
      const year = formData.year;
      const newDate = `${year}-${month}-01`;

      setDate(dayjs(newDate));
    },
    [formData]
  );

  /** Generates an array of 5 years, beginning with current year
   * so that dropdown can be populated dynamically
   *
   * Input: current year (global variable that is dynamically determined)
   * Returns: Array like [2023, 2024, 2025, 2026, 2027]
   */
  function generateYears(currentYear: number) {
    const years = [currentYear];
    let year = currentYear;
    for (let i = 0; i < 4; i++) {
      year++;
      years.push(year);
    }
    return years;
  }

  /** Calls formData setter function with updated month/year when drop down changed */
  function handleChange(evt: ChangeEvent<HTMLSelectElement>) {
    const input = evt.target;

    setFormData((formData) => ({
      ...formData,
      [input.name]: +input.value,
    }));
  }

  /** Calls formdata setter function with updated month/year when forward button clicked */
  function handleForwardClick() {
    let month = date.get("month") + 1;
    let year = date.get("year");

    if (month > 11) {
      month = 0;
      year++;
    }

    setFormData({ year, month });
  }

  /** Calls formdata setter function with updated month/year when back button clicked */
  function handleBackClick() {
    let month = date.get("month") - 1;
    let year = date.get("year");

    if (month < 0) {
      month = 11;
      year--;
    }

    setFormData({ year, month });
  }

  return (
    <div className="pt-10 relative logged-in">
      <div className="flex justify-center pb-3">
        <form>
          <select
            className="border-2 border-black rounded h-10 px-2 mr-1"
            name="month"
            id="month"
            value={formData.month}
            onChange={handleChange}
          >
            {MONTHS.map((month, i) => (
              <option key={uuidv4()} value={i}>
                {month}
              </option>
            ))}
          </select>
          <select
            className="border-2 border-black rounded h-10 px-2 mr-2"
            name="year"
            id="year"
            value={formData.year}
            onChange={handleChange}
          >
            {yearsForDropdown.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </form>
        <div>
          <button
            onClick={handleBackClick}
            disabled={
              formData.month === 0 && formData.year === yearsForDropdown[0]
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-10 h-10 hover:bg-gray-200 rounded-full ${
                formData.month === 0 && formData.year === yearsForDropdown[0]
                  ? "invisible"
                  : "visible"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button
            onClick={handleForwardClick}
            disabled={
              formData.month === 11 && formData.year === yearsForDropdown[4]
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-10 h-10 hover:bg-gray-200 rounded-full ${
                formData.month === 11 && formData.year === yearsForDropdown[4]
                  ? "invisible"
                  : "visible"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <Calendar datesBooked={datesBooked} date={date} userRole={session?.user?.role!}/>
      <Footer />
    </div>
  );
}
