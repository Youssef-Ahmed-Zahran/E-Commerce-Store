const { User } = require("../models/userModel");
const { asyncHandler } = require("../middlewares/asyncHandler");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/createToken");

/**
 *   @desc   Register New User
 *   @route  /api/auth/register
 *   @method  Post
 *   @access  public
 */
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs.");
  }

  const user = await User.findOne({ email });

  if (user) {
    res.status(400).json({ message: "User already exists." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    const createdUser = await newUser.save();
    generateToken(res, createdUser._id, createdUser.isAdmin);
    const { password, ...other } = createdUser._doc;
    res.status(201).json({ ...other });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 *   @desc   Login User
 *   @route  /api/auth/login
 *   @method  Post
 *   @access  public
 */
const loginUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).json({ message: "invalid email or password." });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid email or password." });
  }

  generateToken(res, user._id, user.isAdmin);

  const { password, ...other } = user._doc;

  res.status(200).json({ ...other });
});

/**
 *   @desc   Logout User
 *   @route  /api/auth/logout
 *   @method  Post
 *   @access  public
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", " ", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "User logged out successfully",
  });
});

module.exports = {
  createUser,
  loginUser,
  logoutUser,
};
