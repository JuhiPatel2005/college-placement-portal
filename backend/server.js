const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// connect DB
connectDB();

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API Running");
});

const { protect } = require("./middleware/authMiddleware");
const { authorizeRoles } = require("./middleware/roleMiddleware");

app.get("/test", protect, authorizeRoles("company"), (req, res) => {
  res.send("You are a company user");
});

const opportunityRoutes = require("./routes/opportunityRoutes");
app.use("/api/opportunities", opportunityRoutes);

const applicationRoutes = require("./routes/applicationRoutes");
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
