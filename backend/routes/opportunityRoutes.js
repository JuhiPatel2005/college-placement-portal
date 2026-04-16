const express = require("express");
const router = express.Router();

const {
  createOpportunity,
  getOpportunities,
  deleteOpportunity,
  updateOpportunity,
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

router.delete(
  "/:id",
  protect,
  authorizeRoles("company", "tpo", "superadmin"),
  deleteOpportunity
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("company", "tpo", "superadmin"),
  updateOpportunity
);

module.exports = router;