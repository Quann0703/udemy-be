const express = require("express");
const router = express.Router();
const registerController = require("../../controllers/RegisterController");
const {
  authenticateUser,
  checkUserLogin,
} = require("../../middleware/authMiddleware");

router.all("*", authenticateUser);

router.get("/", registerController.getRegister);
router.post("/", checkUserLogin, registerController.createRegister);
router.put("/:id", registerController.updateRegister);
router.delete("/:id", registerController.deleteRegister);

module.exports = router;
