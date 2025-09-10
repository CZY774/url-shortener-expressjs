const express = require("express");
const Link = require("../models/Link");
const router = express.Router();

// Get stats for a specific link
router.get("/:id", async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!link) {
      return res.status(404).render("stats/index", {
        error: "Link not found",
        user: req.user,
      });
    }

    res.render("stats/index", {
      link,
      user: req.user,
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
    });
  } catch (error) {
    res.status(500).render("stats/index", {
      error: "Error fetching stats",
      user: req.user,
    });
  }
});

module.exports = router;
