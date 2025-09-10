import { Response } from "express";
import Link from "../models/Link";
import generateShortCode from "../utils/generateShortCode";
import { AuthRequest } from "../types";

// Get all links for user
const getLinks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const links = await Link.find({ createdBy: req.user!._id }).sort({
      createdAt: -1,
    });
    res.render("dashboard/index", {
      links,
      user: req.user,
      baseUrl: process.env.BASE_URL || "http://localhost:3000", // Tambahkan ini
    });
  } catch (error) {
    res.status(500).render("dashboard/index", {
      error: "Error fetching links",
      links: [],
      baseUrl: process.env.BASE_URL || "http://localhost:3000", // Tambahkan ini juga
    });
  }
};

// Create new short link
const createLink = async (req: AuthRequest, res: Response): Promise<void> => {
  const { originalUrl, title } = req.body;

  try {
    const shortCode = generateShortCode();
    const link = await Link.create({
      originalUrl,
      shortCode,
      title,
      createdBy: req.user!._id,
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
const showCreateForm = (req: AuthRequest, res: Response): void => {
  res.render("dashboard/create", { user: req.user });
};

// Delete a link
const deleteLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      createdBy: req.user!._id,
    });

    if (!link) {
      res.status(404).json({ error: "Link not found" });
      return;
    }

    await Link.deleteOne({ _id: req.params.id });
    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export { getLinks, createLink, showCreateForm, deleteLink };
