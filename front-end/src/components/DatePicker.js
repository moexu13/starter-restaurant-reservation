import React, { useEffect, useState } from "react";
import { today, previous, next } from "../utils/date-time";

const DatePicker = ({ date, handleDateChange }) => {
  
  const [reservationDate, setReservationDate] = useState(date);

  useEffect(() => {
    setReservationDate(date);
  }, [date]);
  
  const handleChange = e => {
    setReservationDate(e.target.value);
  }
  
  const handleSubmit = e => {
    e.preventDefault();
    handleDateChange(reservationDate);
  }

  const handleToday = () => {
    setReservationDate(today);
    handleDateChange(today);
  }

  const handlePreviousDay = () =>  {
    setReservationDate(previous);
    handleDateChange(previous);
  }

  const handleNextDay = () => {
    setReservationDate(next);
    handleDateChange(next);
  }

  return (
    <div className="container date-picker">
      <div className="row">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <input name="date" type="date" value={reservationDate} onChange={handleChange} />
            <button type="submit" className="btn btn-primary btn-sm">Go</button>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="btn-group m-2" role="group">
          <button type="button" className="btn btn-secondary" onClick={handlePreviousDay}>
            &larr;
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleToday}>
            Today
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleNextDay}>
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default DatePicker;