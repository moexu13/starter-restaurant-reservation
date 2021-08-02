import React from "react";
import { Link } from "react-router-dom";

const Reservation = ({ reservation }) => {
  if (!reservation) return null;
  const name = `${reservation.first_name} ${reservation.last_name}`;
  const phone = reservation.mobile_number;
  const time = reservation.reservation_time;
  const people = reservation.people;

  return (
    <div className="reservation">
      <table className="reservation__details">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Time</th>
            <th>People</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {name}
            </td>
            <td>
              {phone}
            </td>
            <td>
              {time}
            </td>
            <td>
              {people}
            </td>
            <td>
              <Link className="link" to={`/reservations/${reservation.reservation_id}/seat`}>
                Seat
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Reservation;