const commentService = require("../services/commentService");
const generateSlug = require("../utils/generateSlug");
const db = require("../models");
const { date } = require("joi");

class CommentController {
  constructor() {
    this.model = "comment";
    this.route = "/comments";
  }
  //api
  //[GET] /comments
  getComments = async (req, res) => {
    const data = await commentService.find({
      include: [
        {
          model: db.User,
          as: "user",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    return res.status(200).json(data);
  };

  //[POST] /comments
  createComments = async (req, res) => {
    try {
      const userId = req?.user?.id;
      const { comment, parentId } = req.body;

      if (!userId) {
        return res.status(400).json({
          code: -1,
          message: "User ID is required",
        });
      }

      if (!comment) {
        return res.status(400).json({
          code: -1,
          message: "Comment content is required",
        });
      }

      const data = await commentService.create({
        ...req.body,
        userId,
      });

      if (data.code === -1) {
        return res.status(500).json(data);
      }

      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({
        code: -1,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  updateComment = async (req, res) => {
    const id = req.params.id;
    const data = await commentService.update({
      data: {
        ...req.body,
      },
      where: {
        id,
      },
    });
    if (data.code === -1) {
      return res.status(500).json(data);
    }

    res.json(data);
  };
  // [DELETE] /comments/:id
  deleteComments = async (req, res) => {
    const id = req.params.id;

    const data = await commentService.delete({
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
module.exports = new CommentController();
