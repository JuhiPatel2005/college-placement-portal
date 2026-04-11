const Opportunity = require("../models/Opportunity");


// 🔹 CREATE opportunity
exports.createOpportunity = async (req, res) => {
  try {
    const { title, company, description, type, location, salary, stipend, duration } = req.body;
    // create in DB
    const opportunity = await Opportunity.create({
      title,
      company,
      description,
      type,
      location,
      salary,
      stipend,
      duration,
      createdBy: req.user.id
    });

    res.status(201).json(opportunity);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 🔹 GET all opportunities
exports.getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find();

    res.json(opportunities);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};