import { ENV, Environment } from "./env";

interface EnvConfig {
  BASE_URL: string;
  SOCKET_BASE_URL: string;
}

const CONFIGS: Record<Environment, EnvConfig> = {
  [Environment.LOCAL]: {
    BASE_URL: "http://localhost:8080/api/v1/",
    SOCKET_BASE_URL: "http://localhost:8080",
  },
  [Environment.DEV]: {
    BASE_URL: "http://localhost:8080/api/v1/",
    SOCKET_BASE_URL: "http://localhost:8080",
  },
  [Environment.PROD]: {
    BASE_URL: "http://localhost:8080/api/v1/",
    SOCKET_BASE_URL: "http://localhost:8080",
  },
  [Environment.PREPROD]: {
    BASE_URL: "http://localhost:8080/api/v1/",
    SOCKET_BASE_URL: "http://localhost:8080",
  },
};

const currentConfig = CONFIGS[ENV] || CONFIGS[Environment.DEV];

const CONSTANTS = {
  BASE_URL: currentConfig.BASE_URL,
  SOCKET_BASE_URL: currentConfig.SOCKET_BASE_URL,

  URL: {
    // Admin endpoints
    ADMIN_LOGIN: "admin/login",
    CHANGE_PASS: "admin/change/pass",
    FORGOT_PASS: "admin/forgot/pass",
    RESET_PASS: "admin/reset/pass",
    LOGOUT: "admin/logout",

    // School endpoints
    SCHOOL_LOGIN: "school/login",
    SCHOOL_CHANGE_PASS: "school/change/pass",
    SCHOOL_FORGOT_PASS: "school/forgot/pass",
    SCHOOL_RESET_PASS: "school/reset/pass",
    SCHOOL_LOGOUT: "school/logout",
  },

  ACTION_TYPE: {
    // Admin auth
    LOGIN_REQUEST: "LOGIN_REQUEST",
    LOGIN_FAIL: "LOGIN_FAIL",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_RESET: "LOGIN_RESET",
    LOGOUT_ADMIN_SUCCESS: "LOGOUT_ADMIN_SUCCESS",
    LOGOUT_CLEAR: "LOGOUT_CLEAR",
    ERROR: "ERROR",
    LOGOUT_USER_FAIL: "LOGOUT_USER_FAIL",
    RESET_PASSWORD_REQUEST: "RESET_PASSWORD_REQUEST",
    RESET_PASSWORD_SUCCESS: "RESET_PASSWORD_SUCCESS",
    RESET_PASSWORD_FAILURE: "RESET_PASSWORD_FAILURE",
    MODULE_LIST: "MODULE_LIST",
    TEMP_PASS: "TEMP_PASS",
    MODULE_LIST_CLEAR: "MODULE_LIST_CLEAR",
    ADMIN_LIST: "ADMIN_LIST",

    // School auth
    SCHOOL_LOGIN_REQUEST: "SCHOOL_LOGIN_REQUEST",
    SCHOOL_LOGIN_FAIL: "SCHOOL_LOGIN_FAIL",
    SCHOOL_LOGIN_SUCCESS: "SCHOOL_LOGIN_SUCCESS",
    SCHOOL_LOGIN_RESET: "SCHOOL_LOGIN_RESET",
    SCHOOL_LOGOUT_CLEAR: "SCHOOL_LOGOUT_CLEAR",
    SCHOOL_TEMP_PASS: "SCHOOL_TEMP_PASS",
  },
} as const;

export default CONSTANTS;
export type AppConstants = typeof CONSTANTS;
