const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const userRouter = require("./user");
const categoryRouter = require("./category");
const courseRouter = require("./course");
const lessonRouter = require("./lesson");
const registerRouter = require("./register");
const invoiceRouter = require("./invoice");
const fieldsRouter = require("./field");
const topicRouter = require("./topic");

router.get("/", (req, res) => {
  res.render("pages/dashboard");
});

router.use("/", authRouter);
router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/fields", fieldsRouter);
router.use("/topics", topicRouter);
router.use("/courses", courseRouter);
router.use("/lessons", lessonRouter);
router.use("/registers", registerRouter);
router.use("/invoices", invoiceRouter);

module.exports = router;
