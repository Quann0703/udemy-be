const { raw } = require("mysql2");
const db = require("../models");

const methodsService = (Model) => {
  const methods = {
    find: async (payload) => {
      try {
        let data;
        if (payload.where) {
          if (payload.where.id) {
            data = await db[Model].findByPk(payload.where.id, {
              include: payload.include,
              raw: true,
              ...payload,
            });
          } else if (payload.findOne) {
            data = await db[Model].findOne({
              where: {
                ...payload.where,
              },
              include: payload.include,
              ...payload,
            });
          } else {
            data = await db[Model].findAll({
              include: payload.include,
              where: { ...payload.where },
              raw: false,
            });
          }
        } else if (payload.page) {
          const page = +payload.page < 1 ? 1 : +payload.page;
          const pageSize = +payload.pageSize || 10;
          const skip = (page - 1) * pageSize;
          const search = payload.search || {};

          const { count, rows } = await db[Model].findAndCountAll({
            where: {
              ...search,
            },
            offset: skip,
            limit: pageSize,
            include: payload.include,
            raw: true,
          });
          const pageNumber = Math.ceil(+count / +pageSize);

          data = {
            count,
            page,
            pageSize,
            pageNumber,
            rows,
          };
        } else {
          data = await db[Model].findAll({
            include: payload.include,
            ...payload,
          });
        }

        if (data) {
          return {
            code: 0,
            message: "ok",
            data: data,
          };
        } else {
          return {
            code: 1,
            message: "Data is not exist!",
            data: [],
          };
        }
      } catch (error) {
        return {
          code: -1,
          message: "Something wrong in the server",
          data: [{ error }],
        };
      }
    },
    create: async (payload) => {
      try {
        const [data, isCreated] = await db[Model].findOrCreate({
          where: { ...payload },
          raw: true,
        });

        if (isCreated) {
          return {
            code: 0,
            message: "ok",
            data: data,
          };
        } else {
          return {
            code: 1,
            message: "Data was exist!",
            data: [],
          };
        }
      } catch (error) {
        console.log(error);
        return {
          code: -1,
          message: "Something wrong in the server",
          data: [{ error }],
        };
      }
    },
    update: async (payload) => {
      try {
        const data = await db[Model].update(
          { ...payload.data },
          {
            where: {
              ...payload.where,
            },
          }
        );

        if (data[0]) {
          return {
            code: 0,
            message: "ok",
            data: data,
          };
        }

        return {
          code: 1,
          message: "Data is not exist!",
          data: [],
        };
      } catch (error) {
        return {
          code: -1,
          message: "Something wrong in the server",
          data: [{ error }],
        };
      }
    },
    delete: async (payload) => {
      try {
        const data = await db[Model].destroy({
          where: {
            ...payload.where,
          },
        });

        if (data) {
          return {
            code: 0,
            message: "ok",
            data: data,
          };
        }

        return {
          code: 1,
          message: "Data is not exist!",
          data: [],
        };
      } catch (error) {
        return {
          code: -1,
          message: "Something wrong in the server",
          data: [{ error }],
        };
      }
    },
  };

  return methods;
};

module.exports = methodsService;
