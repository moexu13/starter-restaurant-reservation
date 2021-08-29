import React, { useEffect, useState } from "react";
import Reservation from "./Reservation";

const ReservationList = ({ reservations }) => {
  const [reservationsMap, setReservationsMap] = useState([]);

  useEffect(() => {
    setReservationsMap(reservations.map(reservation => (
      <Reservation 
        reservation={reservation} 
        key={reservation.reservation_id}
      />)
    ))
  }, [reservations]);

  return (
    <div className="reservations-list">
      <div className="reservation__details--header row mb-3 mt-3">  
        <div className="col-3"><h5>Name</h5></div>
        <div className="col-2"><h5>Phone</h5></div>
        <div className="col-1"><h5>Time</h5></div>
        <div className="col-1"><h5>People</h5></div>
        <div className="col-1"><h5>Status</h5></div>
        <div className="col-1">&nbsp;</div>
        <div className="col-1">&nbsp;</div>
      </div>
      {reservationsMap}
    </div>
  );
}

export default ReservationList;