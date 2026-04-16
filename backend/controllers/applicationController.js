const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");

async function findApplicationPopulated(id) {
  return Application.findById(id)
    .populate("student", "name email role year branch college")
    .populate(
      "opportunity",
      "title company type location salary stipend duration createdBy",
    );
}

exports.applyToOpportunity = async (req, res) => {
  try {
    const { opportunityId, cgpa, phone, skills, appliedRole, coverLetter } =
      req.body;

    if (!opportunityId) {
      return res.status(400).json({ message: "Opportunity ID is required" });
    }

    const cgpaNum = cgpa !== undefined && cgpa !== "" ? Number(cgpa) : NaN;
    const cleanPhone = typeof phone === "string" ? phone.trim() : "";
    if (!cleanPhone || Number.isNaN(cgpaNum)) {
      return res
        .status(400)
        .json({ message: "Valid CGPA and phone are required" });
    }
    if (cgpaNum < 0 || cgpaNum > 10) {
      return res.status(400).json({ message: "CGPA must be between 0 and 10" });
    }
    if (!/^[0-9+\-\s()]{8,20}$/.test(cleanPhone)) {
      return res.status(400).json({ message: "Phone number format is invalid" });
    }

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

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resumePath = `uploads/${req.file.filename}`.replace(/\\/g, "/");

    const application = await Application.create({
      student: req.user.id,
      opportunity: opportunityId,
      cgpa: cgpaNum,
      phone: cleanPhone,
      skills,
      resume: resumePath,
      appliedRole,
      coverLetter,
    });

    const populated = await findApplicationPopulated(application._id);
    req.app.get("io")?.emit("applications:updated", {
      type: "created",
      applicationId: String(application._id),
    });
    res.status(201).json(populated);
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
      .sort({ createdAt: -1 })
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
      .sort({ createdAt: -1 })
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
    const { status, totalRounds, currentRound } = req.body;
    const validStatuses = ["applied", "shortlisted", "rejected"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const opportunity = await Opportunity.findById(application.opportunity);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (req.user.role === "company") {
      const ownerId = opportunity.createdBy?.toString();
      if (!ownerId || ownerId !== String(req.user.id)) {
        return res.status(403).json({
          message: "Not authorized to update this application",
        });
      }
    }

    if (status) application.status = status;
    if (totalRounds !== undefined) {
      const rounds = Number(totalRounds);
      if (Number.isNaN(rounds) || rounds < 1) {
        return res.status(400).json({ message: "Total rounds must be at least 1" });
      }
      application.totalRounds = rounds;
      if (application.currentRound > rounds) {
        application.currentRound = rounds;
      }
    }
    if (currentRound !== undefined) {
      const round = Number(currentRound);
      if (Number.isNaN(round) || round < 0) {
        return res.status(400).json({ message: "Current round must be 0 or greater" });
      }
      const maxRounds = Number(application.totalRounds || 1);
      if (round > maxRounds) {
        return res.status(400).json({ message: "Current round cannot exceed total rounds" });
      }
      application.currentRound = round;
    }
    await application.save();

    const populated = await findApplicationPopulated(application._id);
    req.app.get("io")?.emit("applications:updated", {
      type: "status-updated",
      applicationId: String(application._id),
    });
    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadOfferLetter = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const opportunity = await Opportunity.findById(application.opportunity);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (req.user.role === "company") {
      const ownerId = opportunity.createdBy?.toString();
      if (!ownerId || ownerId !== String(req.user.id)) {
        return res.status(403).json({ message: "Not authorized to upload offer letter" });
      }
    }

    if (!req.file) {
      return res.status(400).json({ message: "Offer letter PDF is required" });
    }
    const mimetype = String(req.file.mimetype || "").toLowerCase();
    if (mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF offer letters are allowed" });
    }

    const offerPath = `uploads/${req.file.filename}`.replace(/\\/g, "/");
    if (application.status !== "shortlisted") {
      application.status = "shortlisted";
    }
    application.offerLetter = offerPath;
    await application.save();

    const populated = await findApplicationPopulated(application._id);
    req.app.get("io")?.emit("applications:updated", {
      type: "offer-letter-uploaded",
      applicationId: String(application._id),
    });
    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
