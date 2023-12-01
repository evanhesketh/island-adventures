"use client";

import { useEffect, useState } from "react";

import CalendarForm from "../../components/CalendarForm";
import Loading from "../loading";
import { BookingDataInterface } from "../../../types/interfaces";

/**
 *
 * Component that fetches booking data via api/availability
 *
 * Props: none
 * State:
 * -processedBookingData: {owners: {2023: {9: {2: 'Smith', 3: 'Smith', 4: 'Smith'}}}, renters: {}}
 *
 * Availability -> Calendar
 */
export default function Availability() {
  const [processedBookingData, setProcessedBookingData] =
    useState<BookingDataInterface>({ owners: {}, renters: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(function fetchBookingData() {
    async function fetchData() {
      try {
        const res = await fetch("api/availability", { method: "GET" });
        const bookingData = await res.json();
        setProcessedBookingData(bookingData.processedBookingData);
        setLoading(false);
      } catch (error) {
        console.log("Unable to get booking information");
        setLoading(false);
        setError("Unable to complete request at this time");
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <Loading/>
  }

  if (error) {
    return <div className="text-center mt-10">{error}</div>
  }

  return <div>{<CalendarForm datesBooked={processedBookingData} />}</div>;
}
