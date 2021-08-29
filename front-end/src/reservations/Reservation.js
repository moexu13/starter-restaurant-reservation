import React, { useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { updateStatus } from "../utils/api";
import { capitalizeFirstLetter } from "../utils/utils";

const Reservation = ({ reservation  }) => {
  const [error, setError] = useState(null)
  if (!reservation) return null;
  const name = `${reservation.first_name} ${reservation.last_name}`;
  const phone = reservation.mobile_number;
  const time = reservation.reservation_time;
  const people = reservation.people;
  const status = capitalizeFirstLetter(reservation.status);

  const seatLink = <Link className="link" to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link>;

  const editLink = <Link className="link" to={`/reservations/${reservation.reservation_id}/edit`}>Edit</Link>;

  const handleClick = async () => {
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      await updateStatus(reservation.reservation_id, "cancelled")
        .catch(err => setError(err));
    }
  }
  
  return (
    <div className="reservation">
      <ErrorAlert error={error} />
      <div className="reservation__details row justify-content-start mb-3">
        <div className="col-3">
          {name}
        </div>
        <div className="col-2">
          {phone}
        </div>
        <div className="col-1">
          {time}
        </div>
        <div className="col-1">
          {people}
        </div>
        <div className="col-1">
          {status}
        </div>
        <div className="col-1">
          {status === "Booked" ? seatLink : ""}
        </div>
        <div className="col-1">
          {status === "Booked" ? editLink : ""}
        </div>
        <div className="col-1">
          <button 
            className="btn btn-secondary" 
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={handleClick}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reservation;