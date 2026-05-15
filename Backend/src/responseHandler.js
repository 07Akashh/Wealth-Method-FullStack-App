// ======================== Response Handler ========================
const customException = require("./customException");
const APIResponse = require("./model/APIResponse");

function _sendResponse(res, result, status = 200) {
  return res.status(status).json(result);
}

function sendSuccess(res, result) {
  const outResult = new APIResponse(200, result);
  return _sendResponse(res, outResult, 200);
}

function sendError(res, error) {
  let statusCode = error?.status || 500;

  if (!error?.customException) {
    error = customException.completeCustomException("intrnlSrvrErr", error?.message);
  }

  const result = new APIResponse(statusCode, error);
  if (result.err) delete result.err.status;
  return _sendResponse(res, result, statusCode);
}

function handleError(error, req, res, next) {
  sendError(res, error);
}

const defaultRoute = (req, res) => {
  res.status(404).json({
    status: 404,
    err: { errCode: "NOT_FOUND", msg: "Route not found." },
  });
};

module.exports = { sendSuccess, sendError, handleError, defaultRoute };
