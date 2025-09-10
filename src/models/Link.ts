import mongoose, { Document, Schema } from "mongoose";
import { ILink, IClick } from "../types";

const clickSchema = new Schema<IClick>({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  referrer: String,
  userAgent: String,
  ipAddress: String,
});

const linkSchema = new Schema<ILink>(
  {
    originalUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
            v
          );
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid URL!`,
      },
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    clickHistory: [clickSchema],
    title: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILink>("Link", linkSchema);
