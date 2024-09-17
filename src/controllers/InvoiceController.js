const db = require("../models");
const userService = require("../services/userService");
const courseService = require("../services/courseService");
const invoiceService = require("../services/invoiceService");
const { where } = require("sequelize");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

class InvoiceController {
  constructor() {
    this.model = "invoice";
    this.route = "/invoices";
  }

  // WEB
  // [GET] /invoices
  index = async (req, res) => {
    const invoices = await invoiceService.find({
      include: [
        {
          model: db.Course,
          as: "course",
          attributes: ["id", "title"],
        },
        { model: db.User, as: "user", attributes: ["id", "username"] },
      ],
      raw: true,
    });
    const courses = await courseService.find({ raw: true });
    const users = await userService.find({ raw: true });

    // res.json(invoices);

    res.render("pages/" + this.model + "/show", {
      invoices: invoices.data,
      users: users.data,
      courses: courses.data,
      route: this.route,
      message: req.flash("info"),
      error: req.flash("error"),
    });
  };

  // [POST] /invoices
  store = async (req, res) => {
    const data = await invoiceService.create({ ...req.body });

    if (data.data[0]?.error) {
      req.flash("error", data.message);
    } else {
      req.flash("info", "Create success!");
    }
    res.redirect("back");
  };

  // [GET] /invoices/:id/edit
  edit = async (req, res) => {
    const id = req.params.id;
    const { data } = await invoiceService.find({ where: { id } });
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

  // [PATCH] /invoices/:id
  update = async (req, res) => {
    const id = req.params.id;
    const data = await invoiceService.update({ data: req.body, where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
      return res.redirect("back");
    } else {
      req.flash("info", "Update success!");
    }
    res.redirect(this.route);
  };

  // [DELETE] /invoices/:id
  destroy = async (req, res) => {
    const id = req.params.id;
    const data = await invoiceService.delete({ where: { id } });
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

  //[GET] /invoices
  getInvoice = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const data = await invoiceService.find({
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
  // [POST] /invoices
  createInvoice = async (req, res) => {
    const userId = req?.user?.id;
    const data = await invoiceService.create({ ...req.body, userId });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };

  // [PUT] /invoices/:id
  updateInvoice = async (req, res) => {
    const id = req.params.id;
    const data = await invoiceService.update({
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

  // [DELETE] /invoices/:id
  deleteInvoice = async (req, res) => {
    const id = req.params.id;

    const data = await invoiceService.delete({
      where: {
        id,
      },
    });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };
  getInvoiceId = async (req, res) => {
    const id = req.params.id;

    const data = await invoiceService.find({
      where: {
        id,
      },
      include: [
        {
          model: db.Course,
          as: "course",
          attributes: ["id", "title", "image", "price"],
        },
        { model: db.User, as: "user", attributes: ["id", "username", "email"] },
      ],
      raw: false,
    });
    console.log(data);
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };
}

module.exports = new InvoiceController();
