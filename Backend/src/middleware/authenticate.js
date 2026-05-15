// ======================== Authentication Middleware ========================
"use strict";

const customException = require("../customException");
const jwtHandler = require("../jwtHandler");
const appUtils = require("../utils/appUtils");

/**
 * Middleware factory — validates Bearer JWT and attaches req.user
 * @param {"all" | 1 | 2} onlyValidFor — role check (1=admin, 2=user, "all"=any)
 */
const authenticate = (onlyValidFor = "all") => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.accessToken || req.get("accessToken");

    if (!token) {
      return next(customException.unauthorizeAccess());
    }

    jwtHandler
      .verifyToken(token)
      .then((payload) => {
        // Role check
        if (onlyValidFor !== "all" && payload.role !== onlyValidFor) {
          throw customException.completeCustomException("forbidden");
        }
        req.user = payload;
        req.role = payload.role;
        next();
      })
      .catch((err) => {
        appUtils.logError({
          moduleName: "authenticate",
          methodName: "authenticate",
          err,
        });
        next(err);
      });
  };
};

/**
 * Admin-only shorthand
 */
const adminOnly = authenticate(1);

module.exports = { authenticate, adminOnly };
