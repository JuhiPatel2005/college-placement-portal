const Opportunity = require("../models/Opportunity");

// 🔹 CREATE opportunity
exports.createOpportunity = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      type,
      location,
      salary,
      stipend,
      duration,
    } = req.body;

    if (!title || !company || !description || !type) {
      return res
        .status(400)
        .json({ message: "Title, company, description and type are required" });
    }

    const opportunity = await Opportunity.create({
      title,
      company,
      description,
      type,
      location,
      salary,
      stipend,
      duration,
      createdBy: req.user.id,
    });

    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 GET opportunities
exports.getOpportunities = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === "company") {
      filter.createdBy = req.user.id;
    }

    const opportunities = await Opportunity.find(filter);

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
