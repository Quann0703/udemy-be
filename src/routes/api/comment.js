const express = require("express");
const router = express.Router();
const commentController = require("../../controllers/CommentController");
const {
  authenticateUser,
  checkUserLogin,
} = require("../../middleware/authMiddleware");

router.all("*", authenticateUser);

router.get("/", commentController.getComments);
router.post("/", checkUserLogin, commentController.createComments);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComments);

module.exports = router;
