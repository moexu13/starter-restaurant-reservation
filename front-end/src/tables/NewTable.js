import React, { useState } from "react";
import { useHistory } from "react-router";

import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

const NewTable = () => {
  const initialFormData = {
    table_name: "",
    capacity: 1
  }
  
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ ...initialFormData })
  const history = useHistory();
  
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value
    });
  }
  
  const handleSubmit = e => {
    e.preventDefault();
    createTable(formData).then(() => {
        history.push("/");
    })
    .catch(setError);
  }

  const handleCancel = e => {
    e.preventDefault();
    history.push("/");
  }
  
  return (
    <div className="container form-container">
      <form onSubmit={handleSubmit} className="form table-form">
      <ErrorAlert error={error} />
        <div className="row">
          <label className="form-label" htmlFor="table_name">
            Table Name
            <input 
              id="table_name"
              name="table_name" 
              type="text" 
              className="form-field"
              onChange={handleChange}
              value={formData.table_name}
              required
            />
          </label>
        </div>
        
        <div className="row">
          <label className="form-label" htmlFor="capacity">
            Number of People
            <input 
              id="capacity"
              name="capacity" 
              type="text" 
              className="form-field"
              onChange={handleChange}
              value={formData.capacity}
              required 
            />
          </label>
        </div>

        <div className="row">
          <button type="submit" className="btn btn-primary">Add Table</button>
          <button type="cancel" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTable;