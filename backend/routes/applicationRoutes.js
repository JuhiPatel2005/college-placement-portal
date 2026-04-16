const express = require("express");
const router = express.Router();

const {
  applyToOpportunity,
  getApplications,
  getStudentApplications,
  updateApplicationStatus,
  uploadOfferLetter,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/apply",
  protect,
  authorizeRoles("student"),
  upload.single("resume"),
  applyToOpportunity,
);

router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentApplications,
);

router.get("/", protect, authorizeRoles("company", "tpo", "superadmin"), getApplications);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("company", "tpo", "superadmin"),
  updateApplicationStatus,
);

router.post(
  "/:id/offer-letter",
  protect,
  authorizeRoles("company", "tpo", "superadmin"),
  upload.single("offerLetter"),
  uploadOfferLetter,
);

module.exports = router;
