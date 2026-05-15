// ======================== Express Config ========================
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const rateLimit = require("express-rate-limit");

module.exports = function (app, cfg) {
  // Security headers
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: cfg.corsOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "accessToken",
      ],
    })
  );

  // Cookie parser
  app.use(cookieParser());

  // Method override (for PUT/DELETE via POST)
  app.use(
    methodOverride((req) => {
      if (req.body && typeof req.body === "object" && "_method" in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
      }
    })
  );

  // Global rate limiter
  const limiter = rateLimit({
    windowMs: cfg.rateLimitWindowMs,
    max: cfg.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 429,
      err: { msg: "Too many requests, please try again later." },
    },
  });
  app.use("/api/", limiter);

  // Auth rate limiter (stricter for login/register)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
      status: 429,
      err: { msg: "Too many auth attempts. Please wait 15 minutes." },
    },
  });
  app.use("/api/v1/auth/", authLimiter);

  // Preflight
  app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });
};
