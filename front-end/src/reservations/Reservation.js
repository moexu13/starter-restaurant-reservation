import React from "react";

const Reservation = ({ reservation }) => {
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
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Reservation;