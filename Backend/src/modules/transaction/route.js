// ======================== Transaction Route ========================
const txRouter = require("express").Router();
const txFacade = require("./facade");
const resHndlr = require("../../responseHandler");
const { authenticate, receiptUpload } = require("../../middleware");
const upload = require("../../middleware/upload");

// Dashboard stats (Authenticated)
txRouter.get("/stats", authenticate("all"), (req, res) => {
  txFacade.getDashboardStats(req.user._id)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

txRouter.get("/insights", authenticate("all"), (req, res) => {
  txFacade.getInsights(req.user._id)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

// Bulk sync from mobile (Authenticated)
txRouter.post("/sync", authenticate("all"), (req, res) => {
  txFacade.syncTransactions(req.user._id, req.body.transactions)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

// Standard CRUD (Authenticated)
txRouter.post("/", authenticate("all"), upload.single("receiptFile"), receiptUpload, (req, res) => {
  txFacade.addTransaction(req.user._id, req.body)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

txRouter.get("/", authenticate("all"), (req, res) => {
  txFacade.getTransactions(req.user._id, req.query)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

txRouter.put("/:id", authenticate("all"), upload.single("receiptFile"), receiptUpload, (req, res) => {
  txFacade.updateTransaction(req.user._id, req.params.id, req.body)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

txRouter.delete("/:id", authenticate("all"), (req, res) => {
  txFacade.deleteTransaction(req.user._id, req.params.id)
    .then((result) => resHndlr.sendSuccess(res, result))
    .catch((err) => resHndlr.sendError(res, err));
});

module.exports = txRouter;
