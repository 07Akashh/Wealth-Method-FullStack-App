// ======================== Status Codes ========================
module.exports = {
  intrnlSrvrErr: {
    code: "INTERNAL_SERVER_ERROR",
    msg: "An internal server error occurred.",
    status: 500,
  },
  unauth_access: {
    code: "UNAUTHORIZED",
    msg: "Unauthorized access. Please login.",
    status: 401,
  },
  tokenGenError: {
    code: "TOKEN_GEN_ERROR",
    msg: "Token generation failed.",
    status: 500,
  },
  validationError: {
    code: "VALIDATION_ERROR",
    msg: "Validation failed.",
    status: 422,
  },
  usr_nt_exst: {
    code: "USER_NOT_FOUND",
    msg: "User does not exist.",
    status: 404,
  },
  user_nt_fnd: {
    code: "USER_NOT_FOUND",
    msg: "User not found.",
    status: 404,
  },
  inactive_user: {
    code: "INACTIVE_USER",
    msg: "Your account is inactive. Please contact support.",
    status: 403,
  },
  deleted_user: {
    code: "DELETED_USER",
    msg: "This account has been deleted.",
    status: 403,
  },
  no_pass: {
    code: "NO_PASSWORD",
    msg: "No password set. Please use social login.",
    status: 400,
  },
  session_expire: {
    code: "SESSION_EXPIRED",
    msg: "Session expired. Please login again.",
    status: 401,
  },
  invalid_credentials: {
    code: "INVALID_CREDENTIALS",
    msg: "Invalid email or password.",
    status: 401,
  },
  tx_not_found: {
    code: "TRANSACTION_NOT_FOUND",
    msg: "Transaction not found.",
    status: 404,
  },
  goal_not_found: {
    code: "GOAL_NOT_FOUND",
    msg: "Goal not found.",
    status: 404,
  },
  budget_not_found: {
    code: "BUDGET_NOT_FOUND",
    msg: "Budget not found.",
    status: 404,
  },
  forbidden: {
    code: "FORBIDDEN",
    msg: "You do not have permission to perform this action.",
    status: 403,
  },
};
