const { raw } = require("body-parser");
const db = require("../models");
const processService = require("../services/processService");
const registerService = require("../services/registerService");
const stepService = require("../services/stepService");
const trackService = require("../services/trackService");
const { where } = require("sequelize");

class StepController {
  getStepByUuid = async (req, res) => {
    const uuid = req.params.uuid;
    const { data } = await stepService.find({
      findOne: true,
      where: { uuid },
      include: [
        {
          model: db.Lesson,
          as: "lesson",
          include: {
            model: db.Quiz,
            as: "quizzes",
            include: {
              model: db.Answer,
              as: "answers",
            },
          },
        },
      ],
      raw: false,
    });
    //check xem đã có trong process chưa
    console.log(data);
    // lấy nextStep
    const nextStep = await stepService.find({
      findOne: true,
      where: { priority: data.priority + 1, trackId: data.trackId },
    });
    const prevStep = await stepService.find({
      findOne: true,
      where: { priority: data.priority - 1 },
    });
    res.json({
      data: {
        step: data,
        nextStep: nextStep.data.uuid,
        prevStep: prevStep.data.uuid ?? null,
      },
    });
  };
  saveUserProcess = async (req, res) => {
    const stepUuid = req.body.stepUuid;
    const { code, data: step } = await stepService.find({
      findOne: true,
      where: { uuid: stepUuid },
    });

    const existingProcess = await processService.find({
      findOne: true,
      where: { stepId: step.id, userId: req?.user?.id },
    });
    console.log(existingProcess);

    let data;

    if (!existingProcess || existingProcess.code === 1) {
      // Nếu tiến trình chưa tồn tại, tạo mới
      data = await processService.create({
        trackId: step.trackId,
        stepId: step.id,
        userId: req?.user?.id,
        dateCompleted: new Date(),
      });
    } else {
      data = existingProcess;
    }
    //cập nhập tiến trình
    const [steps, track, processes] = await Promise.all([
      stepService.find({
        where: {
          trackId: step.trackId,
        },
      }),
      trackService.find({ where: { id: step.trackId } }),
      processService.find({
        where: { trackId: step.trackId, userId: req?.user?.id },
      }),
    ]);
    const userProcess = (processes.data.length / steps.data.length) * 100;
    registerService.update({
      data: {
        process: userProcess,
      },
      where: {
        courseId: track.data.courseId,
        userId: req?.user?.id,
      },
    });

    if (code === -1) {
      res.status(500).json(data.message);
    }

    res.json({
      data: {
        saved: true,
      },
    });
  };
}
module.exports = new StepController();
