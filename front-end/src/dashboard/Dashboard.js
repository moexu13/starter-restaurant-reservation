import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { prettyPrintDate } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

import DatePicker from "../components/DatePicker";
import ReservationList from "../reservations/ReservationList";
import { useHistory } from "react-router";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();
  const { state } = history.location;

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationDate, setReservationDate] = useState(date);
  
  useEffect(loadDashboard, [reservationDate]);
  
  useEffect(() => {
    if (state && state.resDate) {
      setReservationDate(state.resDate);
      history.replace("/dashboard", {});
    }
  }, []);
  
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
        <h4 className="mb-0">Reservations for&nbsp; 
          {prettyPrintDate(reservationDate)}
        </h4>
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
