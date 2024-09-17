const { raw } = require("mysql2");
const bcrypt = require("bcryptjs");
const userService = require("../services/userService");

class UserController {
  constructor() {
    this.model = "user";
    this.route = "/users";
  }

  // WEB
  // [GET] /users
  index = async (req, res) => {
    const users = await userService.find({ raw: true });
    res.render("pages/" + this.model + "/show", {
      users: users.data,
      route: this.route,
      message: req.flash("info"),
      error: req.flash("error"),
    });
  };

  // [POST] /users
  store = async (req, res) => {
    const data = await userService.create(req.body);

    if (data.data[0]?.error) {
      req.flash("error", data.message);
    } else {
      req.flash("info", "Create success!");
    }
    res.redirect("back");
  };

  // [GET] /users/:id/edit
  edit = async (req, res) => {
    const id = req.params.id;
    const { data } = await userService.find({ where: { id } });
    res.render("pages/" + this.model + "/edit", {
      [this.model]: data,
      route: this.route,
      error: req.flash("error"),
    });
  };

  // [PATCH] /users/:id
  update = async (req, res) => {
    const id = req.params.id;
    const data = await userService.update({ data: req.body, where: { id } });
    if (data.data[0]?.error) {
      req.flash("error", data.message);
      return res.redirect("back");
    } else {
      req.flash("info", "Update success!");
    }
    res.redirect(this.route);
  };

  // [DELETE] /users/:id
  destroy = async (req, res) => {
    const id = req.params.id;
    const data = await userService.delete({ where: { id } });
    console.log("🚀 ~ UserController ~ destroy= ~ data:", data);
    if (data.data[0]?.error) {
      req.flash("error", data.message);
    } else {
      req.flash("info", "Delete success!");
    }
    res.redirect("back");
  };

  // API
  // [GET] /users
  getUser = async (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const data = await userService.find({
      page: page,
      pageSize,
    });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };

  // [POST] /users
  createUser = async (req, res) => {
    console.log(req.body);
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const data = await userService.create({
      ...req.body,
      password: userService.hashPassword(req.body.password),
    });

    if (data.code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };

  // [PUT] /users/:id
  updateUser = async (req, res) => {
    const id = req.params.id;
    const data = await userService.update({
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

  // [DELETE] /users/:id
  deleteUser = async (req, res) => {
    const id = req.params.id;

    const data = await userService.delete({
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

module.exports = new UserController();
