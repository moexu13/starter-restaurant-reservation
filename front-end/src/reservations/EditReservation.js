import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createReservation, readReservation } from "../utils/api";
import { isPastDate, isTuesday, isRestaurantClosed } from "../utils/validation";
import ErrorAlert from "../layout/ErrorAlert";

const EditReservation = () => {

  const { reservationId } = useParams();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
    status: "booked"
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState([]);
  const [errorDisplay, setErrorDisplay] = useState(null);
  const [buttonText, setButtonText] = useState("Add Reservation");
  const history = useHistory();
  
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      if (reservationId) {
        const reservation = await readReservation(reservationId);
        setFormData(reservation);
        setButtonText("Save");
      }
    }
    fetchData();
  }, [reservationId]);

  useEffect(() => {
    setErrorDisplay(null);
    setErrorDisplay(error.map((err, index) => (
      <ErrorAlert error={err} key={index} />
    )));
  }, [error]);

  // TODO: move validation to run on field change
  const handleSubmit = e => {
    e.preventDefault();
    setError([]);
    const isPast = isPastDate(formData.reservation_date, formData.reservation_time);
    const isTues = isTuesday(formData.reservation_date);
    const isClosed = isRestaurantClosed(formData.reservation_date, formData.reservation_time);

    if (!isPast && !isTues && !isClosed) {
      createReservation(formData).then(() => {
        history.push("/dashboard", { resDate: formData.reservation_date });
      })
      .catch(err => setError(existingErrors => (
        [ ...existingErrors, err ])));
    } else {
      if (isPast) {
        setError(existingErrors => (
          [ ...existingErrors,{ message: "Reservation date can't be in the past" }]
        ));
      }
      if (isTues) {
        setError(existingErrors => (
          [ ...existingErrors, { message: "Reservation date can't be a Tuesday" }]
        ));
      }
      if (isClosed) {
        setError(existingErrors => (
          [ ...existingErrors, { message: "Reservation time must be between 10:30 AM and 9:30 PM"}]
        ));
      }
    }
  }

  const handleCancel = e => {
    e.preventDefault();
    history.push("/");
  }

  return (
    <div className="container form-container">
      <form onSubmit={handleSubmit} className="form reservation-form m-3">
        {errorDisplay}
        <div className="row">
          <div className="col-xl mb-1">
            <label className="form-label" htmlFor="first_name">
              First Name
              <input 
                id="first_name"
                name="first_name" 
                type="text" 
                className="form-control"
                onChange={handleChange}
                value={formData.first_name}
                required
              />
            </label>
          </div>
        </div>
        
        <div className="row">
          <div className="col-xl mb-1">
            <label className="form-label" htmlFor="last_name">
              Last Name
              <input
                id="last_name" 
                name="last_name" 
                type="text" 
                className="form-control"
                onChange={handleChange}
                value={formData.last_name} 
                required
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-xl mb-1">
            <label className="form-label" htmlFor="mobile_number">
              Mobile Number
              <input 
                id="mobile_number"
                name="mobile_number" 
                type="phone" 
                className="form-control"
                onChange={handleChange}
                value={formData.mobile_number}
                required 
              />
            </label>
          </div>
        </div>

        <div className="row">
            <div className="col-xl mb-1">
            <label className="form-label" htmlFor="reservation_date">
              Reservation Date
              <input 
                id="reservation_date"
                name="reservation_date" 
                type="date" 
                className="form-control"
                onChange={handleChange}
                value={formData.reservation_date}
                required 
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-xl mb-1">
            <label className="form-label" htmlFor="reservation_time">
              Reservation Time
              <input 
                id="reservation_time"
                name="reservation_time" 
                type="time" 
                className="form-control"
                onChange={handleChange}
                value={formData.reservation_time}
                required 
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-xl mb-1">
            <label className="form-label" htmlFor="people">
              Number of People
              <input 
                id="people"
                name="people" 
                type="number" 
                className="form-control"
                onChange={handleChange}
                value={formData.people}
                required 
              />
            </label>
          </div>
        </div>
        
        <div className="row">
          <div className="col-xl mt-2">
            <button type="submit" className="btn btn-primary">{buttonText}</button>
            <button type="cancel" className="btn btn-secondary ml-1" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditReservation;