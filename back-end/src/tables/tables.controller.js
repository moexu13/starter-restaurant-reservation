/**
 * List handler for tables resources
 */
 const service = require("./tables.service");
//  const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

 const list = async (req, res) => {
  const tables = await service.list();
  res.json({
    data: tables,
  });
}

module.exports = {
  list,
}