// ======================== Goal Route ========================
const goalRouter = require("express").Router();
const goalFacade = require("./facade");
const resHndlr = require("../../responseHandler");
const { authenticate } = require("../../middleware/authenticate");

// Bulk sync from mobile (Authenticated)
goalRouter.post("/sync", authenticate("all"), (req, res) => {
  goalFacade.syncGoals(req.user._id, req.body.goals)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

// Standard CRUD (Authenticated)
goalRouter.post("/", authenticate("all"), (req, res) => {
  goalFacade.addGoal(req.user._id, req.body)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

goalRouter.get("/", authenticate("all"), (req, res) => {
  goalFacade.getGoals(req.user._id)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

goalRouter.put("/:id", authenticate("all"), (req, res) => {
  goalFacade.updateGoal(req.user._id, req.params.id, req.body)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

goalRouter.delete("/:id", authenticate("all"), (req, res) => {
  goalFacade.deleteGoal(req.user._id, req.params.id)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

module.exports = goalRouter;
