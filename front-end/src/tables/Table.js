import React from "react";

const Table = ({ table_name, capacity }) => {
  return (
    <div className="table">
      <p>
        {table_name} - {capacity}
      </p>
    </div>
  );
}

export default Table;