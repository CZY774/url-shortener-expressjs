import express from "express";
import { login, register, logout } from "../controllers/authController";

const router = express.Router();

// Login routes
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", login);

// Register routes
router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", register);

// Logout route
router.get("/logout", logout);

export default router;
