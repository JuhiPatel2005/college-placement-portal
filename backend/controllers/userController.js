const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "name email role year branch passingYear college companyName companyWebsite companyDescription createdAt updatedAt",
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      role,
      name,
      year,
      branch,
      passingYear,
      college,
      companyName,
      companyWebsite,
      companyDescription,
    } = req.body;
    const updates = {};
    const allowedFields = [
      "role",
      "name",
      "year",
      "branch",
      "passingYear",
      "college",
      "companyName",
      "companyWebsite",
      "companyDescription",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select(
      "name email role year branch passingYear college companyName companyWebsite companyDescription createdAt updatedAt",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
