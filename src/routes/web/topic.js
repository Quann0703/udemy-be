const express = require("express");
const router = express.Router();
const topicController = require("../../controllers/TopicController");

router.get("/", topicController.index);
router.post("/", topicController.store);
router.get("/:id/edit", topicController.edit);
router.patch("/:id", topicController.update);
router.delete("/:id", topicController.destroy);

module.exports = router;
