// ======================== API Response Model ========================
const STATUS = { SUCCESS: 200 };

class APIResponse {
  constructor(statusCode, result) {
    this.status = statusCode;
    if (statusCode === STATUS.SUCCESS) {
      this.res = result !== undefined ? result : {};
    } else {
      this.err = result !== undefined ? result : {};
    }
  }
}

module.exports = APIResponse;
