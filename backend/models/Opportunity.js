const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["job", "placement", "internship"],
      required: true,
    },

    duration: {
      type: String, // only for internships (e.g., "3 months")
    },

    stipend: {
      type: String, // for internship
    },

    salary: {
      type: String, // for job
    },

    location: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Opportunity", opportunitySchema);
