const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  getCurrentUser,
  getUserById,
  updateCurrentUser,
  deleteUserById,
  updateUserById,
  getAllUsers,
} = require("../controllers/userController");

// Get current logged-in user
router
  .route("/profile")
  .get(verifyToken, getCurrentUser)
  .put(verifyToken, updateCurrentUser);

// ADMIN ROUTES 👇🏻
router.route("/").get(verifyTokenAndAdmin, getAllUsers);

router
  .route("/:id")
  .get(verifyTokenAndAdmin, getUserById)
  .put(verifyTokenAndAdmin, updateUserById)
  .delete(verifyTokenAndAdmin, deleteUserById);

module.exports = router;
