import React, { useEffect, useState } from "react";
import { finishTable, listReservations, listTables } from "../utils/api";
import { prettyPrintDate } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

import DatePicker from "../components/DatePicker";
import ReservationList from "../reservations/ReservationList";
import TableList from "../tables/TableList";
import { useHistory } from "react-router";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();
  const [error, setError] = useState([]);
  const [errorDisplay, setErrorDisplay] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationDate, setReservationDate] = useState(date);
  const [tables, setTables] = useState([]);
  
  useEffect(loadDashboard, [reservationDate]);

  
  useEffect(() => {
    const { state } = history.location;
    if (state && state.resDate) {
      setReservationDate(state.resDate);
      history.replace("/dashboard", {});
    }
  }, [history]);

  // ask if these can be combined into one function that loads
  // tables on initial page load and whenever a table changes
  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch(err => setError(existingErrors => (
        [ ...existingErrors, err ])));
  }, []);

  useEffect(() => {
    setErrorDisplay(null);
    setErrorDisplay(error.map((err, index) => (
      <ErrorAlert error={err} key={index} />
    )));
  }, [error]);

  function loadDashboard() {
    const abortController = new AbortController();
    listReservations({ date: reservationDate }, abortController.signal)
      .then(setReservations)
      .catch(err => setError(existingErrors => (
        [ ...existingErrors, err ])));
    return () => abortController.abort();
  }

  const handleDateChange = date => {
    setReservationDate(date);
  }

  const handleFinishTable = async tableId => {
    await finishTable(tableId);
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch(err => setError(existingErrors => (
        [ ...existingErrors, err ])));
    loadDashboard();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for&nbsp; 
          {prettyPrintDate(reservationDate)}
        </h4>
      </div>
      {errorDisplay}
      <div>
        <DatePicker date={reservationDate} handleDateChange={handleDateChange} />
      </div>

      <ReservationList reservations={reservations} />
      <TableList tables={tables} finishTable={handleFinishTable} />
    </main>
  );
}

export default Dashboard;
