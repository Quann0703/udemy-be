const courseService = require("../services/courseService");
const topicService = require("../services/topicService");
const userService = require("../services/userService");
const trackService = require("../services/trackService");
const stepService = require("../services/stepService");
const uploadService = require("../services/uploadService");
const registerService = require("../services/registerService");
const db = require("../models");
const generateSlug = require("../utils/generateSlug");

const { Op } = require("sequelize");
const { raw } = require("body-parser");

class CourseController {
  constructor() {
    this.model = "course";
    this.route = "/courses";
  }

  // WEB
  // [GET] /courses
  index = async (req, res) => {
    const courses = await courseService.find({
      include: [
        { model: db.Topic, as: "topic", attributes: ["id", "title"] },
        { model: db.User, as: "user", attributes: ["id", "fullName"] },
      ],
      raw: true,
    });

    const topics = await topicService.find({ raw: true });
    res.render("pages/" + this.model + "/show", {
      courses: courses.data,
      topics: topics.data,
      route: this.route,
      message: req.flash("info"),
      error: req.flash("error"),
    });
  };

  // [POST] /courses
  store = async (req, res) => {
    const data = await courseService.create({
      ...req.body,
      slug: generateSlug(req.body.title),
    });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
    } else {
      req.flash("info", "Create success!");
    }
    res.redirect("back");
  };

  // [GET] /courses/:id/edit
  edit = async (req, res) => {
    const id = req.params.id;
    const { data } = await courseService.find({ where: { id } });
    const topics = await topicService.find({});
    res.render("pages/" + this.model + "/edit", {
      [this.model]: data,
      topics: topics.data,
      route: this.route,
      error: req.flash("error"),
    });
  };

  // [PATCH] /courses/:id
  update = async (req, res) => {
    const id = req.params.id;
    const data = await courseService.update({ data: req.body, where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
      return res.redirect("back");
    } else {
      req.flash("info", "Update success!");
    }
    res.redirect(this.route);
  };

  // [DELETE] /courses/:id
  destroy = async (req, res) => {
    const id = req.params.id;
    const data = await courseService.delete({ where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
      return res.redirect("back");
    } else {
      req.flash("info", "Delete success!");
    }
    res.redirect("back");
  };

  //[GET] /courses/:slug
  getCourseBySlug = async (req, res) => {
    const slug = req.params.slug;
    const data = await courseService.find({
      findOne: true,
      where: {
        slug: slug,
      },
      include: [
        {
          model: db.Topic,
          as: "topic",
          attributes: ["id", "title"],
          include: [
            {
              model: db.Field,
              as: "field",
              attributes: ["id", "title"],
              include: [
                {
                  model: db.Category,
                  as: "category",
                  attributes: ["id", "title"],
                },
              ],
            },
          ],
        },
        { model: db.User, as: "user", attributes: ["id", "fullName"] },
      ],
      raw: false,
    });

    const { data: track } = await trackService.find({
      findOne: true,
      where: {
        courseId: data.data.id,
      },
      include: [
        {
          model: db.Step,
          as: "step",
          include: [
            {
              model: db.Lesson,
              as: "lesson",
              attributes: ["id", "duration", "image", "video"],
            },
          ],
        },
      ],
    });

    console.log(track);
    data.data.track = track;

    let isRegistered = false;
    let register;
    //check register
    if (req?.user?.id) {
      register = await registerService.find({
        findOne: true,
        where: {
          courseId: data.data.id,
          userId: req?.user?.id,
        },
      });
      // Kiểm tra nếu tìm thấy đăng ký hợp lệ
      if (register && register.code === 0) {
        isRegistered = !!register.data;
      }
    }
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json({
      data: {
        course: data.data,
        track: track,
        topic: data.data.topic,
        isRegistered: isRegistered,
      },
    });
  };

  // API
  // [GET] /courses
  getCourses = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;

    const data = await courseService.find({
      page: page,
      pageSize,
      include: [
        { model: db.Topic, as: "topic", attributes: ["id", "title"] },
        { model: db.User, as: "user", attributes: ["id", "fullName"] },
      ],
    });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };

  //[GET] /topic
  getTopic = async (req, res) => {
    const data = await topicService.find({ raw: false });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };

  //[GET] /user
  getUser = async (req, res) => {
    const data = await userService.find({ raw: false });
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };

  // [POST] /courses
  createCourses = async (req, res) => {
    let imageUrl = "";
    const userId = req?.user?.id;
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
    if (req.file) {
      imageUrl = await uploadService.uploadImage(file, "single");
    }
    const data = await courseService.create({
      ...req.body,
      image: imageUrl,
      creatorId: userId,
    });
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    trackService.create({ courseId: data.data.id, title: data.data.title });

    res.json(data);
  };

  // [PUT] /courses/:id
  updateCourses = async (req, res) => {
    let imageUrl = "";
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
    if (req.file) {
      imageUrl = await uploadService.uploadImage(file, "single");
    }
    const id = req.params.id;
    const data = await courseService.update({
      data: {
        ...req.body,
        image: imageUrl,
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

  // [DELETE] /courses/:id
  deleteCourses = async (req, res) => {
    const id = req.params.id;

    const data = await courseService.delete({
      where: {
        id,
      },
    });

    const { code } = await trackService.delete({
      where: {
        courseId: id,
      },
    });

    if (data.code === -1 && code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };
  // [GET] /courses/registered
  getRegisteredCourses = async (req, res) => {
    const data = await courseService.find({
      include: [
        {
          model: db.Register,
          as: "register",
          attributes: [],
          where: { userId: req?.user?.id },
        },
        { model: db.User, as: "user", attributes: ["id", "fullName"] },
      ],
      attributes: [
        "id",
        "title",
        "slug",
        "image",
        "icon",
        "oldPrice",
        "price",
        "studentsCount",
        "publishedAt",
        "priority",
        "createdAt",
        [db.Sequelize.col("register.process"), "userProcess"],
      ],
    });
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };

  getCourseUser = async (req, res) => {
    const data = await courseService.find({
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["fullName"],
          where: { id: req?.user?.id },
        },
      ],
      attributes: [
        "id",
        "title",
        "slug",
        "image",
        "icon",
        "oldPrice",
        "price",
        "studentsCount",
        "publishedAt",
        "priority",
        "createdAt",
        "description",
      ],
    });
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };
  // [GET] /search
  search = async (req, res) => {
    const query = req.query.q;
    const type = req.query.type;
    const page = req.query.page;
    let data;
    const keywords = decodeURIComponent(query)
      .split(" ")
      .map((keyword) => `%${keyword}%`);
    if (type === "less") {
      data = await courseService.find({
        include: [
          { model: db.User, as: "user", attributes: ["id", "fullName"] },
        ],
        where: {
          title: {
            [Op.or]: keywords.map((keyword) => ({
              [Op.like]: keyword,
            })),
          },
        },
        limit: 5,
      });
    } else if (type === "more") {
      data = await courseService.find({
        page: page ?? 1,
        include: [
          { model: db.User, as: "user", attributes: ["id", "fullName"] },
        ],
        search: {
          title: {
            [Op.or]: keywords.map((keyword) => ({
              [Op.like]: keyword,
            })),
          },
        },
        raw: false,
      });
    }

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };
}

module.exports = new CourseController();
