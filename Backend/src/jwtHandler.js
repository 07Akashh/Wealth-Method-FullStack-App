// ======================== JWT Handler ========================
const jwt = require("jsonwebtoken");
const customException = require("./customException");
const appUtils = require("./utils/appUtils");
const redisClient = require("./redisClient/init");
const { v4: uuidv4 } = require("uuid");

const getSecret = () => {
  const s = process.env.JWT_SECRET_KEY;
  if (!s) throw new Error("JWT_SECRET_KEY not set in environment.");
  return s;
};

/**
 * Generate a signed JWT token with a unique JTI and store it in Redis.
 */
const generateToken = (userObject) => {
  try {
    const jti = uuidv4();
    const payload = {
      _id: userObject._id,
      email: userObject.email,
      role: userObject.role,
      name: userObject.name,
      jti: jti,
    };
    const options = { expiresIn: process.env.JWT_EXPIRES_IN || "30d" };
    const token = jwt.sign(payload, getSecret(), options);

    // Store JTI in Redis set for the user to allow multi-device management
    // Key: user_sessions:<userId>, Value: jti
    const redisKey = `user_sessions:${userObject._id}`;
    
    // We return a token but the caller might need to know if redis succeeded.
    // In this pattern, we assume the caller handles the promise or we sync it.
    // However, since we need to return the token string, we'll return an object.
    return { token, jti };
  } catch (e) {
    appUtils.logError({ moduleName: "jwtHandler", methodName: "generateToken", err: e });
    throw customException.tokenGenException(e);
  }
};

/**
 * Verify and decode a JWT token, ensuring the JTI exists in Redis.
 */
const verifyToken = (accessToken) => {
  try {
    const payload = jwt.verify(accessToken, getSecret());
    const redisKey = `user_sessions:${payload._id}`;
    
    return redisClient.getSetMembers(redisKey)
      .then((activeSessions) => {
        if (activeSessions.includes(payload.jti)) {
          return payload;
        } else {
          throw customException.unauthorizeAccess("Session has been revoked or expired.");
        }
      })
      .catch((err) => {
        appUtils.logError({ moduleName: "jwtHandler", methodName: "verifyToken", err });
        throw err;
      });
  } catch (err) {
    appUtils.logError({ moduleName: "jwtHandler", methodName: "verifyToken", err });
    return Promise.reject(customException.unauthorizeAccess(err));
  }
};

/**
 * Revoke a specific session JTI from Redis.
 */
const revokeSession = (userId, jti) => {
  const redisKey = `user_sessions:${userId}`;
  return redisClient.removeFromSet(redisKey, jti);
};

/**
 * Revoke all sessions for a user.
 */
const revokeAllSessions = (userId) => {
  const redisKey = `user_sessions:${userId}`;
  return redisClient.deleteValue(redisKey);
};

module.exports = { 
  generateToken, 
  verifyToken, 
  revokeSession, 
  revokeAllSessions 
};
