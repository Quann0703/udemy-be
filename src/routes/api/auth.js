const express = require("express");
const router = express.Router();
const authController = require("../../controllers/AuthController");
const { authenticateUser } = require("../../middleware/authMiddleware");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/registerAdmin", authController.registerAdmin);
router.get("/logout", authController.logout);
router.get("/refresh-token", authController.refreshToken);
router.get("/current-user", authenticateUser, authController.getCurrentUser);

module.exports = router;
