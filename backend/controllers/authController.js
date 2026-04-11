const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1d" },
  );

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  year: user.year,
  branch: user.branch,
  passingYear: user.passingYear,
  college: user.college,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "student",
      year,
      branch,
      passingYear,
      college,
    } = req.body;

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
    });

    const token = createToken(user);
    res.status(201).json({ token, user: sanitizeUser(user) });
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

    const token = createToken(user);
    res.json({ token, user: sanitizeUser(user) });
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
