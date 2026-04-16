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

    const normalizedType = String(type || "").toLowerCase();
    if (!["job", "placement", "internship"].includes(normalizedType)) {
      return res.status(400).json({ message: "Type must be job, placement, or internship" });
    }
    const opportunity = await Opportunity.create({
      title,
      company,
      description,
      type: normalizedType,
      location,
      salary: normalizedType === "internship" ? "" : salary,
      stipend: normalizedType === "internship" ? stipend : "",
      duration: normalizedType === "internship" ? duration : "",
      createdBy: req.user.id,
    });

    req.app.get("io")?.emit("opportunities:updated", {
      type: "created",
      opportunityId: String(opportunity._id),
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

    const category = String(req.query.category || "").toLowerCase();
    if (category === "jobs-and-placements") {
      filter.type = { $in: ["job", "placement"] };
    } else if (category === "internships") {
      filter.type = "internship";
    }

    const opportunities = await Opportunity.find(filter).sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE opportunity
exports.deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (req.user.role === "company") {
      const ownerId = String(opportunity.createdBy || "");
      if (!ownerId || ownerId !== String(req.user.id)) {
        return res.status(403).json({ message: "Not authorized to delete this opportunity" });
      }
    }

    const deletedId = String(opportunity._id);
    await opportunity.deleteOne();
    req.app.get("io")?.emit("opportunities:updated", {
      type: "deleted",
      opportunityId: deletedId,
    });
    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (req.user.role === "company") {
      const ownerId = String(opportunity.createdBy || "");
      if (!ownerId || ownerId !== String(req.user.id)) {
        return res.status(403).json({ message: "Not authorized to update this opportunity" });
      }
    }

    const fields = ["title", "company", "description", "type", "location", "salary", "stipend", "duration"];
    fields.forEach((key) => {
      if (req.body[key] !== undefined) {
        opportunity[key] = req.body[key];
      }
    });

    if (opportunity.type === "job" || opportunity.type === "placement") {
      opportunity.stipend = "";
      opportunity.duration = "";
    } else if (opportunity.type === "internship") {
      opportunity.salary = "";
    }

    await opportunity.save();
    req.app.get("io")?.emit("opportunities:updated", {
      type: "updated",
      opportunityId: String(opportunity._id),
    });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
