const mongoose = require("mongoose");

async function conectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully! 🎉");
  } catch (error) {
    console.log("Connection Failed To MongoDB!", error);
    process.exit(1);
  }
}

module.exports = conectToDB;
