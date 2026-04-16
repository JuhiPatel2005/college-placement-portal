const User = require("../models/User");
const bcrypt = require("bcryptjs");

const sanitizeUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  year: user.year,
  branch: user.branch,
  passingYear: user.passingYear,
  college: user.college,
  companyName: user.companyName,
  companyWebsite: user.companyWebsite,
  companyDescription: user.companyDescription,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      year,
      branch,
      passingYear,
      college,
      companyName,
      companyWebsite,
      companyDescription,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Name, email, password, and role are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      year,
      branch,
      passingYear,
      college,
      companyName,
      companyWebsite,
      companyDescription,
    });

    req.session.user = { id: user._id.toString(), role: user.role };
    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.session.user = { id: user._id.toString(), role: user.role };
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: "Unable to log out" });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out successfully" });
  });
};

exports.updateMe = async (req, res) => {
  try {
    const updates = {};
    const allowedFields = [
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

    ["year", "passingYear"].forEach((field) => {
      if (updates[field] === "" || updates[field] === null) {
        delete updates[field];
      } else if (updates[field] !== undefined) {
        const n = Number(updates[field]);
        if (!Number.isNaN(n)) updates[field] = n;
        else delete updates[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
