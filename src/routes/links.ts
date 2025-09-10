import express from "express";
import {
  getLinks,
  createLink,
  showCreateForm,
  deleteLink,
} from "../controllers/linkController";

const router = express.Router();

// Get all links for user
router.get("/", getLinks);

// Show form to create new link
router.get("/create", showCreateForm);

// Create new short link
router.post("/create", createLink);

// Delete a link
router.delete("/:id", deleteLink);

export default router;
