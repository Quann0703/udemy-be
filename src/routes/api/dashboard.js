const express = require("express");
const router = express.Router();
const fieldController = require("../../controllers/FieldController");
const topicController = require("../../controllers/TopicController");
const courseController = require("../../controllers/CourseController");
const lessonController = require("../../controllers/LessonController");

router.get("/category", fieldController.getCategory);
router.get("/field", topicController.getField);
router.get("/user", courseController.getUser);
router.get("/topic", courseController.getTopic);
router.get("/course", lessonController.getCourses);

module.exports = router;
