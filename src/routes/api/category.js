const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/CategoryController");
// const { authenticateUser } = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/multer");

// router.all("*", authenticateUser);

router.get("/", categoryController.getCategory);
router.post("/", upload, categoryController.createCategory);
router.put("/:id", upload, categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
