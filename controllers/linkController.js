const Link = require("../models/Link");
const generateShortCode = require("../utils/generateShortCode");

// Get all links for user
const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("dashboard/index", { links, user: req.user });
  } catch (error) {
    res.status(500).render("dashboard/index", {
      error: "Error fetching links",
      links: [],
    });
  }
};

// Create new short link
const createLink = async (req, res) => {
  const { originalUrl, title } = req.body;

  try {
    const shortCode = generateShortCode();
    const link = await Link.create({
      originalUrl,
      shortCode,
      title,
      createdBy: req.user._id,
    });

    res.redirect("/links");
  } catch (error) {
    res.status(500).render("dashboard/create", {
      error: "Error creating short link",
      user: req.user,
    });
  }
};

// Show form to create new link
const showCreateForm = (req, res) => {
  res.render("dashboard/create", { user: req.user });
};

// Delete a link
const deleteLink = async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    await Link.deleteOne({ _id: req.params.id });
    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getLinks,
  createLink,
  showCreateForm,
  deleteLink,
};
