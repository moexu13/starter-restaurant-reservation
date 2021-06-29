import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

const NewReservation = () => {

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState(null);
  const history = useHistory();
  
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    createReservation(formData).then(() => {
      history.push("/");
    })
    .catch(setError);
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form reservation-form">
        <ErrorAlert error={error} />
        <label className="form-label" htmlFor="first_name">
          First Name
          <input 
            id="first_name"
            name="first_name" 
            type="text" 
            className="form-field"
            onChange={handleChange}
            value={formData.first_name}
            required
           />
        </label>
        
        <label className="form-label" htmlFor="last_name">
          Last Name
          <input
            id="last_name" 
            name="last_name" 
            type="text" 
            className="form-field"
            onChange={handleChange}
            value={formData.last_name} 
            required
          />
        </label>

        <label className="form-label" htmlFor="mobile_number">
          Mobile Number
          <input 
            id="mobile_number"
            name="mobile_number" 
            type="phone" 
            className="form-field"
            onChange={handleChange}
            value={formData.mobile_number}
            required 
          />
        </label>

        <label className="form-label" htmlFor="reservation_date">
          Reservation Date
          <input 
            id="reservation_date"
            name="reservation_date" 
            type="date" 
            className="form-field"
            onChange={handleChange}
            value={formData.reservation_date}
            required 
          />
        </label>

        <label className="form-label" htmlFor="reservation_time">
          Reservation Time
          <input 
            id="reservation_time"
            name="reservation_time" 
            type="time" 
            className="form-field"
            onChange={handleChange}
            value={formData.reservation_time}
            required 
          />
        </label>

        <label className="form-label" htmlFor="people">
          Number of People
          <input 
            id="people"
            name="people" 
            type="text" 
            className="form-field"
            onChange={handleChange}
            value={formData.people}
            required 
          />
        </label>
        
        <button type="submit" className="btn btn-submit">Add Reservation</button>
      </form>
    </div>
  );
}

export default NewReservation;