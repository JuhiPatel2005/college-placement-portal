const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
    },

    // 🔹 NEW FIELDS
    cgpa: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
    },
    resume: {
      type: String, // store file path or URL
    },
    appliedRole: {
      type: String,
    },
    coverLetter: {
      type: String,
    },

    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied",
    },

    offerLetter: {
      type: String,
    },
    totalRounds: {
      type: Number,
      default: 1,
      min: 1,
    },
    currentRound: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
