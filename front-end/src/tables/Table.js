import React, { useEffect } from "react";

const Table = ({ table, finishTable }) => {

  const table_status = table.reservation_id == null ? "Free" : "Occupied";

  useEffect(() => {
    console.log("res id", table.reservation_id);
  }, [table]);

  const handleClick = () => {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      finishTable(table.table_id);
      // reset table status
      // table_status = "Free";
    }
  }

  const buttonText = () => {
    if (table_status === "Occupied") {
      return (
        <button onClick={handleClick} 
          className="btn btn-secondary btn-sm" 
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
      <p>
        {table.table_name} - {table.capacity} &nbsp;
        <span data-table-id-status={table.table_id}>{table_status}&nbsp;</span>
        {buttonText()}
      </p>
    </div>
  );
}

export default Table;