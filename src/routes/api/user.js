const express = require("express");
const router = express.Router();
const userController = require("../../controllers/UserController");
const { authenticateUser } = require("../../middleware/authMiddleware");

router.all("*", authenticateUser);

router.get("/", userController.getUser);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
