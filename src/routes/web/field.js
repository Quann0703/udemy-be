const express = require("express");
const router = express.Router();
const fieldController = require("../../controllers/FieldController");

router.get("/", fieldController.index);
router.post("/", fieldController.store);
router.get("/:id/edit", fieldController.edit);
router.patch("/:id", fieldController.update);
router.delete("/:id", fieldController.destroy);

module.exports = router;
