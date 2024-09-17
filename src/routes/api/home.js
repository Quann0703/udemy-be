const express = require("express");
const router = express.Router();
const courseController = require("../../controllers/HomeController");
const categoryController = require("../../controllers/CategoryController");
const homeController = require("../../controllers/HomeController");

router.get("/", courseController.getCourses);
router.get("/category", categoryController.getCategories);
router.get("/combined-courses", homeController.getCourses);
module.exports = router;
