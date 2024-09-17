const Joi = require("joi");
const authService = require("../services/authService");
const userService = require("../services/userService");

const schema = Joi.object({
  refreshToken: Joi.string(),
});

class AuthController {
  register = async (req, res) => {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeatPassword: Joi.string().required().valid(Joi.ref("password")),
    }).with("password", "repeatPassword");

    const { error, value } = schema.validate({ ...req.body });
    if (error) {
      return res.status(200).json({
        code: 1, // error message
        message: error.details[0].message,
      });
    }
    console.log(value);
    const data = await authService.handleRegister(value);
    res.status(201).json({ data });
  };
  registerAdmin = async (req, res) => {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeatPassword: Joi.string().required().valid(Joi.ref("password")),
    }).with("password", "repeatPassword");

    const { error, value } = schema.validate({ ...req.body });
    if (error) {
      return res.status(200).json({
        code: 1, // error message
        message: error.details[0].message,
      });
    }
    console.log(value);
    const data = await authService.handleRegisterAdmin(value);
    res.status(201).json({ data });
  };
  login = async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });
    const { error, value } = schema.validate({ ...req.body });
    if (error) {
      return res.status(200).json({
        code: 1,
        message: error.details[0].message,
      });
    }
    const data = await authService.handleLogin(value);
    await authService.updateUserCode(data.data.email, data.data.refreshToken);
    console.log(data);
    if (data.code === -1) {
      return res.status(500).json(data);
    }
    //set cookie
    if (data) {
      res.cookie("accessToken", data.data.accessToken, {
        httpOnly: true,
        maxAge: process.env.MAX_AGE_ACCESS_TOKEN,
      });
      res.cookie("refreshToken", data.data.refreshToken, {
        httpOnly: true,
        maxAge: process.env.MAX_AGE_REFRESH_TOKEN,
      });
    }
    res.status(200).json(data);
  };
  logout = async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ code: 0, message: "ok" });
  };
  // todo

  refreshToken = async (req, res) => {
    const { error, value } = schema.validate({ ...req.body });
    if (error) {
      return res.status(200).json({
        code: 1, // error message
        message: error.details[0].message,
      });
    }
    const data = await authService.handleRegister(value);

    res.status(201).json({ data });
  };

  getCurrentUser = async (req, res) => {
    const user = await userService.find({
      findOne: true,
      where: { ...req.user },
      attributes: {
        exclude: ["password", "type", "code", "createdAt", "updatedAt"],
      },
    });

    return res.status(200).json(user);
  };
}
module.exports = new AuthController();
