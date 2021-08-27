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
      <ul className="reservation__details--header list-group list-group-horizontal">  
        <li className="list-group-item">Name</li>
        <li className="list-group-item">Phone</li>
        <li className="list-group-item">Time</li>
        <li className="list-group-item">People</li>
        <li className="list-group-item">Status</li>
      </ul>
      <ul className="reservation__details list-group list-group-horizontal">
        <li className="list-group-item">
          {name}
        </li>
        <li className="list-group-item">
          {phone}
        </li>
        <li className="list-group-item">
          {time}
        </li>
        <li className="list-group-item">
          {people}
        </li>
        <li className="list-group-item">
          {status}
        </li>
        <li className="list-group-item">
          {status === "Booked" ? seatLink : ""}
        </li>
        <li className="list-group-item">
          {status === "Booked" ? editLink : ""}
        </li>
        <li className="list-group-item">
          <button 
            className="btn btn-secondary" 
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={handleClick}
          >
            Cancel
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Reservation;