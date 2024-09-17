const express = require("express");
const router = express.Router();
const fieldController = require("../../controllers/FieldController");
const { authenticateUser } = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/multer");

router.all("*", authenticateUser);

router.get("/", fieldController.getFields);
router.post("/", upload, fieldController.createFields);
router.put("/:id", upload, fieldController.updateFields);
router.delete("/:id", fieldController.deleteFields);

module.exports = router;
