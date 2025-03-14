const mainRoute = require("express").Router();
const send_email_router = require("./sendEmail");
const vendor_router = require("./vendor");

mainRoute.use("/vendors", vendor_router);
mainRoute.use("/send", send_email_router);

module.exports = mainRoute;
