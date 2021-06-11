import React, { useState } from "react";

const NewReservation = () => {

  const initialFormState = {
    firstName: "",
    lastName: "",
    mobileNumber: "",
    reservationDate: "",
    reservationTime: "",
    people: 1
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    console.log("submitted", formData);
    setFormData({ ...initialFormState });
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form reservation-form">
        <label className="form-label" htmlFor="firstName">
          First Name
          <input 
            id="firstName"
            name="firstName" 
            type="text" 
            className="form-field"
            onChange={handleChange}
            value={formData.firstName}
            required
           />
        </label>
        
        <label className="form-label" htmlFor="lastName">
          Last Name
          <input
            id="lastName" 
            name="lastName" 
            type="text" 
            className="form-field"
            onChange={handleChange}
            value={formData.lastName} 
            required
          />
        </label>

        <label className="form-label" htmlFor="mobileNumber">
          Mobile Number
          <input 
            id="mobileNumber"
            name="mobileNumber" 
            type="text" 
            className="form-field"
            onChange={handleChange}
            value={formData.mobileNumber}
            required 
          />
        </label>

        <label className="form-label" htmlFor="reservationDate">
          Reservation Date
          <input 
            id="reservationDate"
            name="reservationDate" 
            type="text" 
            className="form-field"
            onChange={handleChange}
            value={formData.reservationDate}
            required 
          />
        </label>

        <label className="form-label" htmlFor="reservationTime">
          Reservation Time
          <input 
            id="reservationTime"
            name="reservationTime" 
            type="text" 
            className="form-field"
            onChange={handleChange}
            value={formData.reservationTime}
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