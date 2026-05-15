// ======================== User Route ========================
const userRouter = require("express").Router();
const userFacade = require("./facade");
const sessionFacade = require("./sessionFacade");
const resHndlr = require("../../responseHandler");
const { authenticate } = require("../../middleware/authenticate");

// ---- Auth Routes ----
userRouter.post("/signup", (req, res) => {
  userFacade.signup(req.body)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

userRouter.post("/login", (req, res) => {
  const deviceInfo = {
    userAgent: req.get("User-Agent"),
    ip: req.ip,
    browser: req.get("sec-ch-ua") || req.get("User-Agent"),
    ...(req.body.deviceInfo || {})
  };
  if (req.body.deviceName) {
    deviceInfo.deviceName = req.body.deviceName;
  }
  userFacade.login(req.body, deviceInfo)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

userRouter.post("/forgot-password", (req, res) => {
  userFacade.forgotPass(req.body.email)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

userRouter.post("/reset-password", (req, res) => {
  userFacade.resetPass(req.body)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

// ---- Profile Routes (Authenticated) ----
userRouter.get("/profile", authenticate("all"), (req, res) => {
  userFacade.getProfile(req.user._id)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

userRouter.put("/profile", authenticate("all"), (req, res) => {
  userFacade.updateProfile(req.user._id, req.body)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

userRouter.post("/change-password", authenticate("all"), (req, res) => {
  const { oldPass, newPass } = req.body;
  userFacade.changePassword(req.user._id, oldPass, newPass)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

// ---- Device / Session Management ----
userRouter.get("/sessions", authenticate("all"), (req, res) => {
  sessionFacade
    .listSessions(req.user._id)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

userRouter.delete("/sessions/:sessionId", authenticate("all"), (req, res) => {
  sessionFacade
    .revokeSession(req.user._id, req.params.sessionId)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

userRouter.delete("/sessions/others", authenticate("all"), (req, res) => {
  sessionFacade
    .revokeAllOthers(req.user._id, req.user.jti)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

userRouter.post("/logout", authenticate("all"), (req, res) => {
  sessionFacade
    .revokeSession(req.user._id, req.user.jti)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

module.exports = userRouter;
