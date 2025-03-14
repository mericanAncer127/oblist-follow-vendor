const db = require("../db/index");
const cors = require("cors");
require("dotenv").config();

db()
  .then(() => {
    const express = require("express");
    const bodyParser = require("body-parser");
    const routes = require("../routes/index");

    const app = express();
    const PORT = process.env.PORT || 4000;

    app.use(cors());
    app.use(bodyParser.json());
    app.use("/", routes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });
