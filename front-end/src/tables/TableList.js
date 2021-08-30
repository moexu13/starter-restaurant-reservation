import React, { useEffect, useState } from "react";

import Table from "./Table";

const TableList = ({ tables }) => {
  const [tableMap, setTableMap] = useState("");

  useEffect(() => {
    setTableMap(tables.map(table => (
      <Table table={table}
        key={table.table_id} 
      />)
    ));
  }, [tables]);

  return (
    <div className="tables">
      <div className="row mt-1 mb-2">
        <div className="col-3">
          <h5>Table - Capacity</h5>
        </div>
        <div className="col-2">
          <h5>Status</h5>
        </div>
      </div>
      <div className="row">
        {tableMap}
      </div>
    </div>
  
  );
}

export default TableList;