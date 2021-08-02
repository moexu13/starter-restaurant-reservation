import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishTable } from "../utils/api";
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
  const { state } = history.location;

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationDate, setReservationDate] = useState(date);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  
  useEffect(loadDashboard, [reservationDate]);
  
  useEffect(() => {
    if (state && state.resDate) {
      setReservationDate(state.resDate);
      history.replace("/dashboard", {});
    }
  }, []);

  // ask if these can be combined into one function that loads
  // tables on initial page load and whenever a table changes
  useEffect(() => {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
  }, []);

  useEffect(() => {
    console.log('table updated', tables)
    // const abortController = new AbortController();
    // setTablesError(null);
    // listTables(abortController.signal)
    //   .then(setTables)
    //   .catch(setTablesError);
  }, [tables]);

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

  const handleFinishTable = async tableId => {
    await finishTable(tableId);
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
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
      <ErrorAlert error={tablesError} />

      <ReservationList reservations={reservations} />
      <h4 className="tables-list">Tables</h4>
      <TableList tables={tables} finishTable={handleFinishTable} />
    </main>
  );
}

export default Dashboard;
