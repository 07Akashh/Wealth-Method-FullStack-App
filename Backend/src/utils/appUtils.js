// ======================== App Utilities ========================
"use strict";

const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const moment = require("moment");
const sha256 = require("sha256");

// ---- Password helpers ----
const genrateOnlyHash = (pass) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pass, salt);
};

const checkWithHash = (pass, hash) => bcrypt.compareSync(pass, hash);

const encryptHashPassword = (password, salt) => bcrypt.hashSync(password, salt);

const generateSaltAndHashForPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return { salt, hash };
};

// ---- Pagination ----
const pagination = (info, defaultLimit = 10) => {
  if (info.all) return {};
  const limit = info.limit && !isNaN(info.limit) ? Number(info.limit) : defaultLimit;
  const page = info.page && !isNaN(info.page) ? Number(info.page) : 0;
  const skip = limit * page;
  return { limit, skip };
};

// ---- Sorting ----
const sorting = (list, info) => {
  if (info.sort_val && info.dir) {
    return list.sort({ [info.sort_val]: info.dir });
  }
  return list.sort({ _id: -1 });
};

// ---- Regex helpers ----
const regexIncase = (val) => ({ $regex: new RegExp(`${val}`), $options: "i" });

const regexIncaseStrict = (val) => ({
  $regex: new RegExp(`^${val}$`),
  $options: "i",
});

// ---- OTP ----
const getRandomOtp = (length = 6, charset = "numeric") =>
  randomstring.generate({ charset, length });

const genOtp = () => Math.floor(1000 + Math.random() * 9000);

const genRandStr = (digit) => {
  const num = Number(digit);
  if (!num) return "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const base64En = (str) => Buffer.from(str).toString("base64");
const base64De = (enStr) => Buffer.from(enStr, "base64").toString("ascii");

// ---- Misc ----
const isObjEmp = (obj) => Object.keys(obj).length === 0;

const withinDay = (date) => moment().diff(moment(date), "hours") < 24;

const filterValidObjectData = (obj) =>
  Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      acc[key] = obj[key];
    }
    return acc;
  }, {});

// ---- Logging ----
const logError = (info) => {
  console.error(
    `[ERROR] ${info?.moduleName}::${info?.methodName} →`,
    info?.err || info?.error
  );
};

// ---- User sanitizer ----
const sanitizeUser = (user) => {
  if (!user) return null;
  if (typeof user.toObject === "function") user = user.toObject();
  const { password, __v, ...rest } = user;
  return rest;
};

// ---- Currency helper ----
const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount);

module.exports = {
  genrateOnlyHash,
  checkWithHash,
  pagination,
  sorting,
  regexIncase,
  regexIncaseStrict,
  getRandomOtp,
  genOtp,
  isObjEmp,
  withinDay,
  filterValidObjectData,
  logError,
  sanitizeUser,
  formatCurrency,
  encryptHashPassword,
  generateSaltAndHashForPassword,
  base64De,
  base64En,
  genRandStr,
};
