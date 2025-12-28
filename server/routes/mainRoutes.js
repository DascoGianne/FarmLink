const express = require("express");
const router = express.Router();

const mainController = require("../controllers/mainController");

router.get("/", mainController.apiStatus);

router.get("/listings", mainController.getAllListings);

module.exports = router;
