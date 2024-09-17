const express = require("express");
const userRouter = require("./user");
const categoryRouter = require("./category");
const HomeRouter = require("./home");
const fieldRouter = require("./field");
const topicRouter = require("./topic");
const courseRouter = require("./course");
const lessonRouter = require("./lesson");
const registerRouter = require("./register");
const invoiceRouter = require("./invoice");
const authRouter = require("./auth");
const trackRouter = require("./track");
const stepRouter = require("./step");
const commentRouter = require("./comment");
const { checkUserLogin } = require("../../middleware/authMiddleware");
const stepController = require("../../controllers/StepController");
const courseController = require("../../controllers/CourseController");

const dashBoardRouter = require("./dashboard");
const router = express.Router();

//router dashboard
router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/fields", fieldRouter);
router.use("/topics", topicRouter);
router.use("/courses", courseRouter);
router.use("/lessons", lessonRouter);
router.use("/registers", registerRouter);
router.use("/invoices", invoiceRouter);
router.use("/dashboard", dashBoardRouter);
//route user
router.use("/home", HomeRouter);
router.use("/auth", authRouter);
router.use("/tracks", trackRouter);
router.use("/steps", stepRouter);
router.use("/comments", commentRouter);

router.get("/search", courseController.search);
router.get("/user-process", stepController.saveUserProcess);
router.post("/user-process", checkUserLogin, stepController.saveUserProcess);
module.exports = router;
