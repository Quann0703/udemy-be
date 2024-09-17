const express = require("express");
const router = express.Router();
const courseController = require("../../controllers/CourseController");
const {
  authenticateUser,
  checkUserLogin,
} = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/multer");

router.get("/", courseController.getCourses);
router.post(
  "/",
  upload,
  checkUserLogin,
  authenticateUser,
  courseController.createCourses
);
router.put("/:id", upload, authenticateUser, courseController.updateCourses);
router.delete("/:id", authenticateUser, courseController.deleteCourses);

router.get(
  "/creator",
  authenticateUser,
  checkUserLogin,
  courseController.getCourseUser
);

router.get(
  "/registered",
  authenticateUser,
  courseController.getRegisteredCourses
);
router.get("/:slug", checkUserLogin, courseController.getCourseBySlug);
// [GET] /courses/registered

module.exports = router;
