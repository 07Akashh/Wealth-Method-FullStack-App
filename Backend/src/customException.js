// ======================== Custom Exception ========================
"use strict";

const statusCodes = require("./status_codes.json");

const completeCustomException = (key, customMsg = null) => {
  const error = statusCodes[key] || statusCodes.intrnlSrvrErr;
  return {
    status: error.status,
    code: error.code,
    message: customMsg || error.msg,
    customException: true,
  };
};

const getCustomErrorException = (msg) => {
  return {
    status: 400,
    code: 400,
    message: msg,
    customException: true,
  };
};

const unauthorizeAccess = (msg = null) => {
  const error = statusCodes.unauth_access;
  return {
    status: error.status,
    code: error.code,
    message: msg || error.msg,
    customException: true,
  };
};

module.exports = {
  completeCustomException,
  getCustomErrorException,
  unauthorizeAccess,
};
