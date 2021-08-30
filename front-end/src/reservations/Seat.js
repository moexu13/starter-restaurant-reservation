import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import { listTables, readReservation, seatTable } from "../utils/api";
import { doesTableHaveCapacity, isTableOccupied } from "../utils/validation";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../reservations/Reservation";

const Seat = () => {
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState(null);
  const [error, setError] = useState([]);
  const [errorDisplay, setErrorDisplay] = useState(null);
  const [tableSelect, setTableSelect] = useState(null);
  const [reservation, setReservation] = useState(null);
  const history = useHistory();
  const { reservationId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal)
    .then(setTables)
    .catch(err => setError(existingErrors => (
      [ ...existingErrors, err ])));
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservationId, abortController.signal)
      .then(setReservation)
      .catch(err => setError(existingErrors => (
        [ ...existingErrors, err ])));
    return () => abortController.abort();
  }, [reservationId]);

  useEffect(() => {
    setTableSelect(tables.map(table => (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>)
    ))
  }, [tables]);

  useEffect(() => {
    setErrorDisplay(null);
    setErrorDisplay(error.map((err, index) => (
      <ErrorAlert error={err} key={index} />
    )));
  }, [error]);

  const handleChange = e => {
    setTableId(e.target.value);
  }

  const handleCancel = e => {
    e.preventDefault();
    history.push("/");
  }

  const handleSubmit = e => {
    e.preventDefault();
    setError([]);
    const isTableIdSet = tableId && tableId !== "default";
    const table = tables.find(item => item.table_id === parseInt(tableId));
    const isOccupied = isTableOccupied(table);
    const hasCapacity = doesTableHaveCapacity(table, reservation);

    if (isTableIdSet && !isOccupied && hasCapacity) {
      seatTable(tableId, reservationId).then(() => {
        history.push("/dashboard");
      })
      .catch(err => setError(existingErrors => (
        [ ...existingErrors, err ])));
    } else {
      if (!isTableIdSet) {
        setError(existingErrors => (
          [ ...existingErrors,{ message: "Please choose a table" }]
        ));
      }
      if (isOccupied) {
        setError(existingErrors => (
          [ ...existingErrors,{ message: "Table is occupied" }]
        ));
      }
      if (!hasCapacity) {
        setError(existingErrors => (
          [ ...existingErrors,{ message: "Table does not have the capacity for the reservation" }]
        ));
      }
    }
  }
  
  return (
    <div className="table-seat">
      {errorDisplay}
      <Reservation reservation={reservation} />
      <form onSubmit={handleSubmit} className="seat-form">
        <label htmlFor="table_id">
          Table
        </label>
        <select name="table_id" onChange={handleChange}>
          <option key="default" value="default">Select a Table</option>
          {tableSelect}
        </select>
        <button type="submit" className="btn btn-primary btn-sm">Seat Reservation</button>
        <button type="cancel" className="btn btn-secondary btn-sm" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Seat;