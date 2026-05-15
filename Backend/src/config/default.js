const path = require("path");

module.exports = {
  msName: "wealth-method",
  TOKEN_EXPIRATION_SEC: 60 * 24 * 60 * 60, // 24 days
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  cryptoKey: process.env.cryptoKey,
  uploadDir: path.resolve("./uploads"),
  basicAuth: {
    username: process.env.basicauthusername,
    password: process.env.basicauthpass,
  },
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    user: process.env.emailUser,
    pass: process.env.emailPass,
    from: process.env.emailFrom,
  },
};
