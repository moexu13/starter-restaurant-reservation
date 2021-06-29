import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { prettyPrintDate } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

import DatePicker from "../components/DatePicker";
import ReservationList from "../reservations/ReservationList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationDate, setReservationDate] = useState(date);

  useEffect(loadDashboard, [reservationDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: reservationDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const handleDateChange = date => {
    setReservationDate(date);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {prettyPrintDate(reservationDate)}</h4>
      </div>
      <div>
        <DatePicker date={reservationDate} handleDateChange={handleDateChange} />
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationList reservations={reservations} />
    </main>
  );
}

export default Dashboard;
