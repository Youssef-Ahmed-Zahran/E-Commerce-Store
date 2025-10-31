const { asyncHandler } = require("../middlewares/asyncHandler");
const bcrypt = require("bcryptjs");
const { User } = require("../models/userModel");

// Http Methods / Verbs

/**
 *   @desc   Get Current User
 *   @route  /api/users/me
 *   @method  Get
 *   @access  private (authenticated user)
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

/**
 *   @desc   Get All User
 *   @route  /api/users
 *   @method  Get
 *   @access  private (only admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

/**
 *   @desc   Get User By Id
 *   @route  /api/users/:id
 *   @method  Get
 *   @access  private (only admin)
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  !user && res.status(404).json({ message: "user not found" });

  res.status(200).json(user);
});

/**
 *   @desc   Update User By Id
 *   @route  /api/users/profile
 *   @method  Put
 *   @access  private (User himself)
 */
const updateCurrentUser = asyncHandler(async (req, res) => {
  let updatedUser = await User.findById(req.user._id);

  if (!updatedUser) {
    return res.status(404).json({ message: "user not found" });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: req.body,
    },
    { new: true }
  ).select("-password");

  res.status(200).json(updatedUser);
});

/**
 *   @desc   Update User By Id
 *   @route  /api/users/:id
 *   @method  Put
 *   @access  private (only admin)
 */
const updateUserById = asyncHandler(async (req, res) => {
  let updatedUser = await User.findById(req.params.id);

  if (!updatedUser) {
    return res.status(404).json({ message: "user not found" });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  ).select("-password");

  res.status(200).json(updatedUser);
});

/**
 *   @desc   Delete User By Id
 *   @route  /api/users/:id
 *   @method  Delete
 *   @access  private (only admin)
 */
const deleteUserById = asyncHandler(async (req, res) => {
  const deletedUser = await User.findById(req.params.id);
  if (deletedUser) {
    if (deletedUser.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: deletedUser._id });
    res.status(200).json({ message: "user has been deleted successfully" });
  } else {
    throw new Error("user not found");
  }
});

module.exports = {
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateCurrentUser,
  deleteUserById,
  updateUserById,
};
