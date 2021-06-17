import React from "react";

const Reservation = ({ reservation }) => {
  const name = `${reservation.first_name} ${reservation.last_name}`;
  const phone = reservation.mobile_number;
  const time = reservation.reservation_time;
  const people = reservation.people;

  return (
    <div className="reservation">
      <ul className="reservation__details">
        <li className="reservation__detail">
          Name: {name} 
        </li>
        <li className="reservation__detail">
          Phone: {phone}
        </li>
        <li className="reservation__detail">
          Time: {time}
        </li>
        <li className="reservation__detail">
          Number in Party: {people}
        </li>
      </ul>
    </div>
  );
}

export default Reservation;