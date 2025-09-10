import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../types";

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

const createToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: maxAge,
  });
};

// Handle login
const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(401).render("auth/login", {
        error: "Invalid username or password",
      });
      return;
    }

    const token = createToken(user._id.toString());
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/links");
  } catch (error) {
    res.status(500).render("auth/login", {
      error: "Server error. Please try again later.",
    });
  }
};

// Handle registration
const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      res.status(400).render("auth/register", {
        error: "Passwords do not match",
      });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).render("auth/register", {
        error: "User already exists with this email or username",
      });
      return;
    }

    const user = await User.create({ username, email, password });
    const token = createToken(user._id.toString());

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/links");
  } catch (error) {
    res.status(500).render("auth/register", {
      error: "Server error. Please try again later.",
    });
  }
};

// Handle logout
const logout = (req: Request, res: Response): void => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

export { login, register, logout };
