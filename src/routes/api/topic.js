const express = require("express");
const router = express.Router();
const topicController = require("../../controllers/TopicController");
const { authenticateUser } = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/multer");
router.all("*", authenticateUser);

router.get("/", topicController.getTopics);
router.post("/", upload, topicController.createTopics);
router.put("/:id", upload, topicController.updateTopics);
router.delete("/:id", topicController.deleteTopics);

module.exports = router;
