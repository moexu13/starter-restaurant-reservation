import React from "react";
import Reservation from "./Reservation";

const ReservationList = ({ reservations }) => {
  return (
    reservations.map(reservation => (
      <Reservation 
        reservation={reservation} 
        key={reservation.reservation_id} 
      />)
    )
  );
}

export default ReservationList;