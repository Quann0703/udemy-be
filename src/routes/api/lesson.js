const express = require("express");
const router = express.Router();
const lessonController = require("../../controllers/LessonController");
const { authenticateUser } = require("../../middleware/authMiddleware");

router.all("*", authenticateUser);

router.get("/", lessonController.getLesson);
router.post("/", lessonController.createLesson);
router.put("/:id", lessonController.updateLesson);
router.delete("/:id", lessonController.deleteLesson);

module.exports = router;
