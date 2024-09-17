const express = require("express");
const router = express.Router();
const trackController = require("../../controllers/TrackController");
const {
  authenticateUser,
  checkUserLogin,
} = require("../../middleware/authMiddleware");

router.all("*", authenticateUser);
router.get("/", checkUserLogin, trackController.getTrack);
module.exports = router;
