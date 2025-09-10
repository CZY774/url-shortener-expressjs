const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.redirect("/auth/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.redirect("/auth/login");
    }

    req.user = user;
    next();
  } catch (error) {
    res.redirect("/auth/login");
  }
};

module.exports = { requireAuth };
