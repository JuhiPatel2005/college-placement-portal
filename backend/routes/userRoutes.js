const express = require("express");
const router = express.Router();
const { getUsers, updateUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/", protect, authorizeRoles("superadmin"), getUsers);
router.patch("/:id", protect, authorizeRoles("superadmin"), updateUser);

module.exports = router;
