const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");

exports.applyToOpportunity = async (req, res) => {
  try {
    const { opportunityId, cgpa, phone, skills, appliedRole, coverLetter } =
      req.body;

    const existing = await Application.findOne({
      student: req.user.id,
      opportunity: opportunityId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const application = await Application.create({
      student: req.user.id,
      opportunity: opportunityId,
      cgpa,
      phone,
      skills,
      resume: req.file ? req.file.path : null,
      appliedRole,
      coverLetter,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "company") {
      const companyOpportunities = await Opportunity.find({
        createdBy: req.user.id,
      }).select("_id");
      filter.opportunity = companyOpportunities.map((item) => item._id);
    }

    const applications = await Application.find(filter)
      .populate("student", "name email role year branch college")
      .populate(
        "opportunity",
        "title company type location salary stipend duration createdBy",
      );
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate(
        "opportunity",
        "title company type location salary stipend duration",
      )
      .populate("student", "name email");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, offerLetter } = req.body;
    const validStatuses = ["applied", "shortlisted", "rejected"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (status) application.status = status;
    if (offerLetter) application.offerLetter = offerLetter;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
