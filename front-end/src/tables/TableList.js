import React from "react";

import Table from "./Table";

const TableList = ({ tables }) => {
  return (
    tables.map(table => (
      <Table 
        table_name={table.table_name}
        capacity={table.capacity} 
        key={table.table_id} 
      />)
    )
  );
}

export default TableList;