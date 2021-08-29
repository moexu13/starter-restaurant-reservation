import React, { useState } from "react";
import { searchByMobileNumber } from "../utils/api";
import ReservationList from "../reservations/ReservationList";

const Search = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [reservationsFound, setReservationsFound] = useState(null);

  const handleChange = e => {
    setMobileNumber(e.target.value);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setReservations([]);
    const searchResults = await searchByMobileNumber(mobileNumber);
    if (searchResults && searchResults.length > 0) {
      setReservations(searchResults);
      setReservationsFound(null);
    } else {
      setReservationsFound("No reservations found");
    }
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col">
          <p className="fw-bold">Enter a customer's phone number</p>
          <form onSubmit={handleSubmit}>
            <input name="mobile_number" type="phone" value={mobileNumber} onChange={handleChange} />
            <button type="submit" className="btn btn-primary btn-sm">Find</button>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ReservationList reservations={reservations} />
          {reservationsFound}
        </div>
      </div>
    </div>
  )
}

export default Search;