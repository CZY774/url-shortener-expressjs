const User = require("../models/User");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// Handle login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).render("auth/login", {
        error: "Invalid username or password",
      });
    }

    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/links");
  } catch (error) {
    res.status(500).render("auth/login", {
      error: "Server error. Please try again later.",
    });
  }
};

// Handle registration
const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).render("auth/register", {
        error: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).render("auth/register", {
        error: "User already exists with this email or username",
      });
    }

    const user = await User.create({ username, email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/links");
  } catch (error) {
    res.status(500).render("auth/register", {
      error: "Server error. Please try again later.",
    });
  }
};

// Handle logout
const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  login,
  register,
  logout,
};
