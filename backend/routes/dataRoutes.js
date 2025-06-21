const express = require("express");
const router = express.Router();
const {
  getAllData,
  getDataById,
  deleteData,
  searchData,
  filterData,
} = require("../controllers/dataController");

router.get("/", getAllData);
router.get("/search", searchData);
router.post("/filter", filterData);
router.get("/:id", getDataById);
router.delete("/:id", deleteData);

module.exports = router;
