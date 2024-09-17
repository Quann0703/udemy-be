const db = require("../models");
const userService = require("../services/userService");
const courseService = require("../services/courseService");
const registerService = require("../services/registerService");

class RegisterController {
  constructor() {
    this.model = "register";
    this.route = "/registers";
  }

  // WEB
  // [GET] /registers
  index = async (req, res) => {
    const registers = await registerService.find({
      include: [
        { model: db.Course, as: "course", attributes: ["id", "title"] },
        { model: db.User, as: "user", attributes: ["id", "username"] },
      ],
      raw: true,
    });
    const courses = await courseService.find({ raw: true });
    const users = await userService.find({ raw: true });

    // res.json(registers);

    res.render("pages/" + this.model + "/show", {
      registers: registers.data,
      users: users.data,
      courses: courses.data,
      route: this.route,
      message: req.flash("info"),
      error: req.flash("error"),
    });
  };

  // [POST] /registers
  store = async (req, res) => {
    const data = await registerService.create({ ...req.body });
    const courseId = req.body.courseId;
    const course = await courseService.find({
      where: { id: courseId },
      raw: false,
    });
    course.data.studentsCount = course.data.studentsCount + 1;
    await course?.data?.save();
    if (data.data[0]?.error) {
      req.flash("error", data.message);
    } else {
      req.flash("info", "Create success!");
    }
    res.redirect("back");
  };

  // [GET] /registers/:id/edit
  edit = async (req, res) => {
    const id = req.params.id;
    const { data } = await registerService.find({ where: { id } });
    const courses = await courseService.find({});
    const users = await userService.find({});
    res.render("pages/" + this.model + "/edit", {
      [this.model]: data,
      users: users.data,
      courses: courses.data,
      route: this.route,
      error: req.flash("error"),
    });
  };

  // [PATCH] /registers/:id
  update = async (req, res) => {
    const id = req.params.id;
    const data = await registerService.update({
      data: req.body,
      where: { id },
    });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
      return res.redirect("back");
    } else {
      req.flash("info", "Update success!");
    }
    res.redirect(this.route);
  };

  // [DELETE] /registers/:id
  destroy = async (req, res) => {
    const id = req.params.id;
    const data = await registerService.delete({ where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
    } else {
      req.flash("info", "Delete success!");
    }
    res.redirect("back");
  };

  //api

  //[GET] /course
  getCourses = async (req, res) => {
    const data = await courseService.find({ raw: false });
    console.log(data);
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };

  //[GET] /user
  getUser = async (req, res) => {
    const data = await userService.find({ raw: false });
    console.log(data);
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };

  //[GET] /registers
  getRegister = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const data = await registerService.find({
      page: page,
      pageSize,
      include: [
        {
          model: db.Course,
          as: "course",
          attributes: ["id", "title", "image"],
        },
        { model: db.User, as: "user", attributes: ["id", "username"] },
      ],
      raw: false,
    });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };
  // [POST] /registers
  createRegister = async (req, res) => {
    try {
      const userId = req?.user?.id;
      console.log(userId);
      const data = await registerService.create({ ...req.body, userId });

      if (data.code === -1) {
        return res.status(500).json(data);
      }

      const course = await courseService.find({
        where: { id: data.data.courseId },
        raw: false,
      });

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!course.data) {
        return res.status(500).json({ message: "Course data is unavailable" });
      }

      course.data.studentsCount += 1;
      await course.data.save();

      res.json(data);
    } catch (error) {
      console.error("Error creating register:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  };

  // [PUT] /registers/:id
  updateRegister = async (req, res) => {
    const id = req.params.id;
    const data = await registerService.update({
      data: {
        ...req.body,
      },
      where: {
        id,
      },
    });
    console.log(data);

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };

  // [DELETE] /register/:id
  deleteRegister = async (req, res) => {
    const id = req.params.id;

    const data = await registerService.delete({
      where: {
        id,
      },
    });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };
}

module.exports = new RegisterController();
