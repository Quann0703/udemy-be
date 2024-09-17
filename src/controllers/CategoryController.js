const categoryService = require("../services/categoryService");
const uploadService = require("../services/uploadService");
const generateSlug = require("../utils/generateSlug");
const db = require("../models");
const { raw } = require("mysql2");

class CategoryController {
  constructor() {
    this.model = "category";
    this.route = "/categories";
  }

  // WEB
  // [GET] /categories
  index = async (req, res) => {
    const categories = await categoryService.find({ raw: true });
    res.render("pages/" + this.model + "/show", {
      categories: categories.data,
      route: this.route,
      message: req.flash("info"),
      error: req.flash("error"),
    });
  };

  // [POST] /categories
  store = async (req, res) => {
    const data = await categoryService.create({
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

  // [GET] /categories/:id/edit
  edit = async (req, res) => {
    const id = req.params.id;
    const { data } = await categoryService.find({ where: { id } });
    res.render("pages/" + this.model + "/edit", {
      [this.model]: data,
      route: this.route,
      error: req.flash("error"),
    });
  };

  // [PATCH] /categories/:id
  update = async (req, res) => {
    const id = req.params.id;
    const data = await categoryService.update({
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

  // [DELETE] /categories/:id
  destroy = async (req, res) => {
    const id = req.params.id;
    const data = await categoryService.delete({ where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
    } else {
      req.flash("info", "Delete success!");
    }
    res.redirect("back");
  };

  // API
  getCategories = async (req, res) => {
    const data = await categoryService.find({
      include: [
        {
          model: db.Field,
          as: "field",
          include: [
            { model: db.Topic, as: "topic", attributes: ["id", "title"] },
          ],
          attributes: ["id", "title"],
        },
      ],
      raw: false,
    });
    console.log(data.data[0]);
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };
  //API Admin

  //[GET] /categories
  getCategory = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const data = await categoryService.find({
      page: page,
      pageSize,
    });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };

  // [POST] /categories
  createCategory = async (req, res) => {
    let imageUrl = "";
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
    if (req.file) {
      imageUrl = await uploadService.uploadImage(file, "single");
    }
    const data = await categoryService.create({ ...req.body, image: imageUrl });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };

  // [PUT] /categories/:id
  updateCategory = async (req, res) => {
    let imageUrl = "";
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
    if (req.file) {
      imageUrl = await uploadService.uploadImage(file, "single");
    }
    const id = req.params.id;
    const data = await categoryService.update({
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

  // [DELETE] /users/:id
  deleteCategory = async (req, res) => {
    const id = req.params.id;

    const data = await categoryService.delete({
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

module.exports = new CategoryController();
