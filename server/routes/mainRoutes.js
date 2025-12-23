const express = require("express");
const router = express.Router();

const mainController = require("../controllers/mainController");

// route uses controller
router.get("/", mainController.test);

module.exports = router;
