import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth";
import linkRoutes from "./routes/links";
import statsRoutes from "./routes/stats";

// Import middleware
import { requireAuth } from "./middleware/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// View engine setup
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "../views"));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/url-shortener")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: Error) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/links", requireAuth, linkRoutes);
app.use("/stats", requireAuth, statsRoutes);

// Home page
app.get("/", (req, res) => {
  res.render("home");
});

// Redirect short URL to original URL
app.get("/:shortCode", async (req, res) => {
  try {
    const Link = require("./models/Link").default;
    const link = await Link.findOne({ shortCode: req.params.shortCode });

    if (link) {
      link.clicks++;
      link.clickHistory.push({ timestamp: new Date() });
      await link.save();

      res.redirect(link.originalUrl);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
