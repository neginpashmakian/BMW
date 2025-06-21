const CarData = require("../models/CarData");

exports.getAllData = async (req, res) => {
  const data = await CarData.find();
  console.log("GET /data called");
  console.log(`Returning ${data.length} items`);
  res.json(data); // ✅ Only one response call
};

exports.getDataById = async (req, res) => {
  const item = await CarData.findById(req.params.id);
  res.json(item);
};

exports.deleteData = async (req, res) => {
  await CarData.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};

exports.searchData = async (req, res) => {
  const q = req.query.q;
  const regex = new RegExp(q, "i");
  const data = await CarData.find({
    $or: [{ brand: regex }, { model: regex }],
  }); // adjust fields
  res.json(data);
};

exports.filterData = async (req, res) => {
  const { field, operator, value } = req.body;
  const query = {};

  if (operator === "contains") query[field] = { $regex: value, $options: "i" };
  else if (operator === "equals") query[field] = value;
  else if (operator === "starts with")
    query[field] = { $regex: "^" + value, $options: "i" };
  else if (operator === "ends with")
    query[field] = { $regex: value + "$", $options: "i" };
  else if (operator === "is empty") query[field] = "";

  const data = await CarData.find(query);
  res.json(data);
};
