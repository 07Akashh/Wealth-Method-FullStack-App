// ======================== Config Index ========================
const dbConfig = require("./dbConfig");
const expressConfig = require("./expressConfig");

const environment = process.env.NODE_ENV || "development";

let envConfig = {};
switch (environment) {
  case "production":
  case "prod":
    envConfig = require("./env/production");
    break;
  case "staging":
  case "stag":
    envConfig = require("./env/staging");
    break;
  case "development":
  case "dev":
  default:
    envConfig = require("./env/development");
    break;
}

const defaultConfig = require("./default");
const cfg = { ...defaultConfig, ...envConfig };

module.exports = { cfg, dbConfig, expressConfig };
