// ======================== User Model ========================
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 2, // 1: Admin, 2: User
    },
    // Wealth Management Fields
    preferredCurrency: {
      type: String,
      default: "INR",
    },
    privacyMode: {
      type: Boolean,
      default: false,
    },
    biometricEnabled: {
      type: Boolean,
      default: false,
    },
    lastPassChnage: {
      type: Date,
    },
    tempPass: String,
    salt: String,
    hash: String,
    img: String,
    status: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    frgt_pass: {
      tkn: String,
      tknTime: {
        type: Date,
        default: Date.now,
      },
    },
    reset_pass: {
      tkn: String,
      tknTime: {
        type: Date,
        default: Date.now,
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
