const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
const { asyncHandler } = require("./asyncHandler");

const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    let token;

    // Read JWT from the 'jwt' cookie
    token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select({
      _id: 1,
      username: 1,
      email: 1,
      isAdmin: 1,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
});

const verifyTokenAndAdmin = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "You are not allowed,Only admin allowed." });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
};
