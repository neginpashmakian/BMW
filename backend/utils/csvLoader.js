const csv = require("csvtojson");
const CarData = require("../models/CarData");
const path = require("path");

async function loadCSV() {
  const count = await CarData.countDocuments();
  if (count > 0) return;

  const filePath = path.join(
    __dirname,
    "../../data/BMW_Aptitude_Test_Test_Data_ElectricCarData.csv"
  );
  const jsonArray = await csv().fromFile(filePath);
  await CarData.insertMany(jsonArray);
  console.log("CSV data loaded into MongoDB");
}

module.exports = loadCSV;
