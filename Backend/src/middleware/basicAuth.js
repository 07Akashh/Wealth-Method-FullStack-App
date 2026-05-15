// ======================== Basic Auth Middleware ========================
const customException = require("../customException");

/**
 * HTTP Basic Authentication middleware.
 * Protects all API routes from unauthenticated external access.
 */
const basicAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    // Skip Basic Auth for preflight and health check
    if (req.method === "OPTIONS" || req.path === "/health") return next();
    res.set("WWW-Authenticate", 'Basic realm="Wealth Method API"');
    return res.status(401).json({
      status: 401,
      err: { errCode: "UNAUTHORIZED", msg: "API key required." },
    });
  }

  const base64 = authHeader.split(" ")[1];
  const [username, password] = Buffer.from(base64, "base64").toString().split(":");

  const validUser = process.env.BASIC_AUTH_USER || "wealthapi";
  const validPass = process.env.BASIC_AUTH_PASS || "wealth_secret_pass";

  if (username !== validUser || password !== validPass) {
    res.set("WWW-Authenticate", 'Basic realm="Wealth Method API"');
    return res.status(401).json({
      status: 401,
      err: { errCode: "UNAUTHORIZED", msg: "Invalid API credentials." },
    });
  }

  next();
};

module.exports = { basicAuthentication };
