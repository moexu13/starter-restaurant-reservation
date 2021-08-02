import React from "react";

import Table from "./Table";

const TableList = ({ tables, finishTable }) => {

  
  return (
    tables.map(table => (
      <Table table={table}
        key={table.table_id}
        finishTable={finishTable} 
      />)
    )
  );
}

export default TableList;