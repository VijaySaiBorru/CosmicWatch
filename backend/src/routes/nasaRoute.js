const express = require("express");
const router = express.Router();

const {
  getAsteroidFeed,
  getAsteroidDetails,
  getAlerts
} = require("../controllers/nasaController");

const {protect} = require("../middleware/authMiddleware");

router.get("/alerts", protect, getAlerts);
router.get("/feed", getAsteroidFeed);
router.get("/:id", getAsteroidDetails);

module.exports = router;
