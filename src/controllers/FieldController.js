const fieldService = require("../services/fieldService");
const categoryService = require("../services/categoryService");
const uploadService = require("../services/uploadService");
const db = require("../models");
const generateSlug = require("../utils/generateSlug");
const { raw } = require("mysql2");

class FieldController {
  constructor() {
    this.model = "field";
    this.route = "/fields";
  }

  //WEB
  //[GET] /fields
  index = async (req, res) => {
    const fields = await fieldService.find({ raw: true });
    const categories = await categoryService.find({ raw: true });
    res.render("pages/" + this.model + "/show", {
      fields: fields.data,
      categories: categories.data,
      route: this.route,
      message: req.flash("info"),
      error: req.flash("error"),
    });
  };

  // [POST] /fields
  store = async (req, res) => {
    const data = await fieldService.create({
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

  //[GET] /fields/:id/edit
  edit = async (req, res) => {
    const id = req.params.id;
    const categories = await categoryService.find({});
    const { data } = await fieldService.find({ where: { id } });
    res.render("pages/" + this.model + "/edit", {
      [this.model]: data,
      categories: categories.data,
      route: this.route,
      error: req.flash("error"),
    });
  };

  // [PATCH] /fields/:id
  update = async (req, res) => {
    const id = req.params.id;
    const data = await fieldService.update({ data: req.body, where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
      return res.redirect("back");
    } else {
      req.flash("info", "Update success!");
    }
    res.redirect(this.route);
  };

  // [DELETE] /fields/:id
  destroy = async (req, res) => {
    const id = req.params.id;
    const data = await fieldService.delete({ where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
    } else {
      req.flash("info", "Delete success!");
    }
    res.redirect("back");
  };

  // API
  // [GET] /fields
  getFields = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const data = await fieldService.find({
      page: page,
      pageSize,
      include: [
        {
          model: db.Category,
          as: "category",
          attributes: ["id", "title"],
        },
      ],
    });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };
  //[GET] /categorys
  getCategory = async (req, res) => {
    const data = await categoryService.find({ raw: false });
    console.log(data);
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };
  // [POST] /fields
  createFields = async (req, res) => {
    let imageUrl = "";
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
    if (req.file) {
      imageUrl = await uploadService.uploadImage(file, "single");
    }
    const data = await fieldService.create({ ...req.body, image: imageUrl });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };

  // [PUT] /fields/:id
  updateFields = async (req, res) => {
    let imageUrl = "";
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
    if (req.file) {
      imageUrl = await uploadService.uploadImage(file, "single");
    }
    const id = req.params.id;
    const data = await fieldService.update({
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

  // [DELETE] /fields/:id
  deleteFields = async (req, res) => {
    const id = req.params.id;

    const data = await fieldService.delete({
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
module.exports = new FieldController();
