import { Response } from "express";
import Link from "../models/Link";
import generateShortCode from "../utils/generateShortCode";
import { AuthRequest } from "../types";
import { Parser as Json2csvParser } from "json2csv";

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

// Download report for a link
const downloadReport = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const link = await Link.findOne({ shortCode, createdBy: req.user!._id });
    if (!link) {
      res.status(404).send("Link not found");
      return;
    }

    // Prepare data for CSV
    const records = (link.clickHistory || []).map((click) => ({
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
      clickedAt: click.timestamp,
    }));

    // CSV export
    const fields = ["createdAt", "updatedAt", "clickedAt"];
    const json2csv = new Json2csvParser({ fields });
    const csv = json2csv.parse(records);

    res.header("Content-Type", "text/csv");
    res.attachment(`report-${shortCode}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).send("Failed to generate report");
  }
};

export { getLinks, createLink, showCreateForm, deleteLink, downloadReport };
