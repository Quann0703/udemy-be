const lessonService = require("../services/lessonService");
const courseService = require("../services/courseService");
const trackService = require("../services/trackService");
const stepService = require("../services/stepService");
const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const { raw } = require("mysql2");
const { where } = require("sequelize");

class LessonController {
  constructor() {
    this.model = "lesson";
    this.route = "/lessons";
  }

  // WEB
  // [GET] /lessons
  index = async (req, res) => {
    let courseId = req.query.c;
    const page = req.query.page;
    const courses = await courseService.find({ raw: true });
    if (!courseId) {
      courseId = courses.data[0].id;
      return res.redirect(`${this.route}?c=${courseId}&page=${1}`);
    }
    if (!page) {
      return res.redirect(`${this.route}?c=${courseId}&page=${1}`);
    }

    const data = await lessonService.find({
      page,
      search: { courseId },
      include: [
        {
          model: db.Course,
          as: "course",
          attributes: ["id", "title"],
        },
      ],
    });

    res.render("pages/" + this.model + "/show", {
      lessons: data.data,
      course: courses.data.find((x) => x.id === +courseId),
      courses: courses.data,
      pageNumber: data.data.pageNumber,
      route: this.route,
      message: req.flash("info"),
      error: req.flash("error"),
    });
  };

  // [POST] /lessons
  store = async (req, res) => {
    const data = await lessonService.create({ ...req.body });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
    } else {
      req.flash("info", "Create success!");
    }
    res.redirect("back");
  };

  // [GET] /lessons/:id/edit
  edit = async (req, res) => {
    const id = req.params.id;
    const { data } = await lessonService.find({ where: { id } });
    const courses = await courseService.find({});
    res.render("pages/" + this.model + "/edit", {
      [this.model]: data,
      courses: courses.data,
      route: this.route,
      error: req.flash("error"),
    });
  };

  // [PATCH] /lessons/:id
  update = async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    const data = await lessonService.update({ data: req.body, where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
      return res.redirect("back");
    } else {
      req.flash("info", "Update success!");
    }
    res.redirect(this.route);
  };

  // [DELETE] /lessons/:id
  destroy = async (req, res) => {
    const id = req.params.id;
    const data = await lessonService.delete({ where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
    } else {
      req.flash("info", "Delete success!");
    }
    res.redirect("back");
  };

  //API

  //[GET] /course
  getCourses = async (req, res) => {
    const data = await courseService.find({ raw: false });
    console.log(data);
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };

  //[GET] /lessons
  getLesson = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
    const courseId = req.query.courseId
      ? parseInt(req.query.courseId, 10)
      : null;

    const data = await lessonService.find({
      page,
      pageSize,
      search: { courseId: courseId },
    });
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };

  // [POST] /lessons
  createLesson = async (req, res) => {
    const image = `https://img.youtube.com/vi/${req.body.video}/sddefault.jpg`;
    const data = await lessonService.create({ ...req.body, image });

    const track = await trackService
      .find({
        findOne: true,
        where: {
          courseId: req.body.courseId,
        },
        raw: true,
      })
      .catch((err) => console.log(err));

    //tao step
    const createStep = await stepService.create({
      uuid: uuidv4(),
      trackId: track.data.id,
      lessonId: data.data.id,
      title: data.data.title,
      content: data.data.content,
    });

    const getStep = await stepService.find({
      where: {
        trackId: track.data.id,
      },
    });

    const maxStep = Math.max.apply(
      null,
      getStep.data.map((item) => item.priority)
    );
    createStep.data.priority = maxStep + 1;
    await createStep?.data?.save();

    if (data.code === -1) {
      return res.status(500).json(data);
    }
    res.json(data);
  };

  // [PUT] /lesson/:id
  updateLesson = async (req, res) => {
    const id = req.params.id;
    const data = await lessonService.update({
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

  // [DELETE] /lessons/:id
  deleteLesson = async (req, res) => {
    const id = req.params.id;

    const data = await lessonService.delete({
      where: {
        id,
      },
    });

    const { code } = await stepService.delete({
      where: {
        lessonId: id,
      },
    });

    if (data.code === -1 && code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };
}

module.exports = new LessonController();
