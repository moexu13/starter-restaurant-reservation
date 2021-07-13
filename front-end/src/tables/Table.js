import React from "react";

const Table = ({ table }) => {
  const table_status = table.reservation_id == null ? "Free" : "Occupied";
  return (
    <div className="table">
      <p>
        {table.table_name} - {table.capacity} &nbsp;
        <span data-table-id-status={table.table_id}>{table_status}</span>
      </p>
    </div>
  );
}

export default Table;