// ======================== Session/Device Model ========================
const mongoose = require("mongoose");
const constant = require("../../constant");

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: constant.DB_MODEL_REF.USER,
      required: true,
      index: true,
    },
    jti: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    deviceInfo: {
      browser: String,
      os: String,
      device: String,
      userAgent: String,
      ip: String,
    },
    deviceName: {
      type: String, // Custom name given by user, e.g., "iPhone 15 Pro"
      default: "Unknown Device",
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);
