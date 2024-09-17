const topicService = require("../services/topicService");
const fieldService = require("../services/fieldService");
const uploadService = require("../services/uploadService");
const generateSlug = require("../utils/generateSlug");
const db = require("../models");

class TopicController {
  constructor() {
    this.model = "topic";
    this.route = "/topics";
  }
  //WEB
  //[GET] /topics
  index = async (req, res) => {
    const topics = await topicService.find({ raw: true });
    const fields = await fieldService.find({ raw: true });
    res.render("pages/" + this.model + "/show", {
      topics: topics.data,
      fields: fields.data,
      route: this.route,
      message: req.flash("info"),
      error: req.flash("error"),
    });
  };

  // [POST] /topics
  store = async (req, res) => {
    const data = await topicService.create({
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

  //[GET] /topics/:id/edit
  edit = async (req, res) => {
    const id = req.params.id;
    const fields = await fieldService.find({});
    const { data } = await topicService.find({ where: { id } });
    res.render("pages/" + this.model + "/edit", {
      [this.model]: data,
      fields: fields.data,
      route: this.route,
      error: req.flash("error"),
    });
  };

  // [PATCH] /topics/:id
  update = async (req, res) => {
    const id = req.params.id;
    const data = await topicService.update({ data: req.body, where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
      return res.redirect("back");
    } else {
      req.flash("info", "Update success!");
    }
    res.redirect(this.route);
  };

  // [DELETE] /topics/:id
  destroy = async (req, res) => {
    const id = req.params.id;
    const data = await topicService.delete({ where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
    } else {
      req.flash("info", "Delete success!");
    }
    res.redirect("back");
  };

  // API
  // [GET] /topics
  getTopics = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const data = await topicService.find({
      page: page,
      pageSize,
      include: [
        {
          model: db.Field,
          as: "field",
          attributes: ["id", "title"],
        },
      ],
    });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };
  //[GET] /fields
  getField = async (req, res) => {
    const data = await fieldService.find({ raw: false });
    console.log(data);
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };
  // [POST] /topics
  createTopics = async (req, res) => {
    let imageUrl = "";
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
    if (req.file) {
      imageUrl = await uploadService.uploadImage(file, "single");
    }
    const data = await topicService.create({ ...req.body, image: imageUrl });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };

  // [PUT] /topic/:id
  updateTopics = async (req, res) => {
    let imageUrl = "";
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
    if (req.file) {
      imageUrl = await uploadService.uploadImage(file, "single");
    }
    const id = req.params.id;
    const data = await topicService.update({
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

  // [DELETE] /topic/:id
  deleteTopics = async (req, res) => {
    const id = req.params.id;

    const data = await topicService.delete({
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
module.exports = new TopicController();
