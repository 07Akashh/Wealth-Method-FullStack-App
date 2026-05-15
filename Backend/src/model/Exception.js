// ======================== Exception Model ========================
class Exception {
  constructor(errorCode, message, status = 400, errorStackTrace = false) {
    this.errCode = errorCode;
    this.msg = message;
    this.status = status;
    if (errorStackTrace) {
      this.errs = errorStackTrace;
    }
  }
}

module.exports = Exception;
