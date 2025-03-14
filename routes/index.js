const mainRoute = require("./public");

const allRoutes = require("express").Router();

allRoutes
  .all((_req, res, next) => {
    next();
  })
  .use(mainRoute);

module.exports = allRoutes;
