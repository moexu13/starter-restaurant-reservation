import React from "react";

const Table = ({ table, finishTable }) => {

  const table_status = table.reservation_id == null ? "free" : "occupied";

  const handleClick = () => {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      finishTable(table.table_id);
    }
  }

  const buttonText = () => {
    if (table_status === "occupied") {
      return (
        <button onClick={handleClick} 
          className="btn btn-secondary btn-sm ml-2" 
          data-table-id-finish={table.table_id}
        >
          Finish
        </button>
      );
    } else {
      return "";
    }
  }
  
  return (
    <div className="table">
      <div className="row">
        <div className="col-3 ml-3">
          {table.table_name} - {table.capacity}
        </div>
        <div className="col-2">
          <span data-table-id-status={table.table_id}>{table_status}</span>
          {buttonText()}
        </div>
      </div>
    </div>
  );
}

export default Table;