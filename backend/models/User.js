const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "tpo", "company", "superadmin"],
      default: "student",
    },

    // 🔹 STUDENT PROFILE DATA
    year: Number,
    branch: String,
    passingYear: Number,
    college: String,

    // 🔹 COMPANY PROFILE DATA
    companyName: String,
    companyWebsite: String,
    companyDescription: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
