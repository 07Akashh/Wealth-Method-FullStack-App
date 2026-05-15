// ======================== Middleware Index ========================
const { authenticate, adminOnly } = require("./authenticate");
const basicAuth = require("./basicAuth");
const receiptUpload = require("./receiptUpload");

module.exports = { authenticate, adminOnly, basicAuth, receiptUpload };
