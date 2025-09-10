import { Request } from "express";
import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

export interface IClick {
  timestamp: Date;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface ILink extends Document {
  _id: ObjectId;
  originalUrl: string;
  shortCode: string;
  createdBy: ObjectId;
  clicks: number;
  clickHistory: IClick[];
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JwtPayload {
  id: string;
}
