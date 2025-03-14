const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = db;
