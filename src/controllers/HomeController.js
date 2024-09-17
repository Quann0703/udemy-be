const { Op } = require("sequelize");
const db = require("../models");
const courseService = require("../services/courseService");
class HomeController {
  // [GET] /combined-courses
  getCourses = async (req, res) => {
    const freeCourses = await courseService.find({
      limit: 8,
      where: { price: 0 },
      order: [["priority", "ASC"]],
      include: [
        { model: db.Topic, as: "topic", attributes: ["id", "title"] },
        { model: db.User, as: "user", attributes: ["id", "fullName"] },
      ],
    });
    const proCourses = await courseService.find({
      limit: 8,
      where: { price: { [Op.gt]: 0 } },
      order: [["priority", "ASC"]],
      include: [
        { model: db.Topic, as: "topic", attributes: ["id", "title"] },
        { model: db.User, as: "user", attributes: ["id", "fullName"] },
      ],
    });

    const languageCourse = await courseService.find({
      limit: 8,
      include: [
        { model: db.Topic, as: "topic", attributes: ["id", "title"] },
        { model: db.User, as: "user", attributes: ["id", "fullName"] },
      ],
      where: {
        language: {
          [Op.or]: ["Tiếng việt"],
        },
      },
      order: [["priority", "ASC"]],
    });

    if (
      freeCourses.code === -1 ||
      proCourses.code === -1 ||
      languageCourse.code === -1
    ) {
      return res.status(500).json({ code: -1, message: "Something wrong!" });
    }

    return res.status(200).json({
      data: {
        freeCourses: freeCourses.data,
        proCourses: proCourses.data,
        languageCourse: languageCourse.data,
      },
    });
  };
}
module.exports = new HomeController();
