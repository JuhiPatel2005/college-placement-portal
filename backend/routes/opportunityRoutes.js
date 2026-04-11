const express = require("express");
const router = express.Router();

const {
  createOpportunity,
  getOpportunities
} = require("../controllers/opportunityController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");


// 🔹 CREATE opportunity (ONLY company + tpo)
router.post(
  "/",
  protect,
  authorizeRoles("company", "tpo"),
  createOpportunity
);


// 🔹 GET all opportunities (ALL logged-in users)
router.get(
  "/",
  protect,
  getOpportunities
);

module.exports = router;