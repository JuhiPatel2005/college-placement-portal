const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: {
        values: ["student", "tpo", "company", "superadmin"],
        message: "Role must be one of: student, tpo, company, superadmin",
      },
      default: "student",
    },

    // 🔹 STUDENT PROFILE DATA
    year: {
      type: Number,
      min: [1, "Year must be a positive number"],
      max: [4, "Year cannot exceed 4"],
    },
    branch: {
      type: String,
      trim: true,
      maxlength: [100, "Branch cannot exceed 100 characters"],
    },
    passingYear: {
      type: Number,
      min: [2020, "Passing year must be 2020 or later"],
      max: [2030, "Passing year cannot exceed 2030"],
    },
    college: {
      type: String,
      trim: true,
      maxlength: [200, "College name cannot exceed 200 characters"],
    },

    // 🔹 COMPANY PROFILE DATA
    companyName: {
      type: String,
      trim: true,
      maxlength: [200, "Company name cannot exceed 200 characters"],
    },
    companyWebsite: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
        "Please enter a valid website URL",
      ],
    },
    companyDescription: {
      type: String,
      trim: true,
      maxlength: [1000, "Company description cannot exceed 1000 characters"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
