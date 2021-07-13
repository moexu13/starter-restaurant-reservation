import React from "react";

import Table from "./Table";

const TableList = ({ tables }) => {
  return (
    tables.map(table => (
      <Table table={table}
        key={table.table_id} 
      />)
    )
  );
}

export default TableList;