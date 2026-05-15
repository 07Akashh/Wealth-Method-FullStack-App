export enum Environment {
  LOCAL = "LOCAL",
  DEV = "DEV",
  PROD = "PROD",
  PREPROD = "PREPROD",
}

// Force LOCAL for current development session
export const ENV: Environment = Environment.LOCAL;

const CONFIG = {
  [Environment.LOCAL]: {
    API_URL: "http://192.168.31.177:8080/api/v1",
    BASIC_AUTH_USER: "wealthapi",
    BASIC_AUTH_PASS: "wealth_secret_pass",
  },
  [Environment.DEV]: {
    API_URL: "https://dev.wealthmethod.com/api/v1",
    BASIC_AUTH_USER: "wealthapi",
    BASIC_AUTH_PASS: "wealth_secret_pass",
  },
  [Environment.PROD]: {
    API_URL: "https://api.wealthmethod.com/api/v1",
    BASIC_AUTH_USER: "wealthapi",
    BASIC_AUTH_PASS: "wealth_secret_pass",
  },
  [Environment.PREPROD]: {
    API_URL: "https://preprod.wealthmethod.com/api/v1",
    BASIC_AUTH_USER: "wealthapi",
    BASIC_AUTH_PASS: "wealth_secret_pass",
  },
};

export const API_CONFIG = CONFIG[ENV];
