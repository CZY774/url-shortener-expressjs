import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest, JwtPayload } from "../types";

const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.redirect("/auth/login");
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    ) as JwtPayload;
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.redirect("/auth/login");
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.redirect("/auth/login");
  }
};

export { requireAuth };
