const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  referrer: String,
  userAgent: String,
  ipAddress: String,
});

const linkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model("Link", linkSchema);
