const webRouter = require('./web');
const apiRouter = require('./api');

const routes = (app) => {
    app.use('/', webRouter);
    app.use('/api/v1', apiRouter);
};

module.exports = routes;
