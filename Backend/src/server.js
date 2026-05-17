// ======================== Wealth Method — Server Entry ========================
console.log("");
console.log("//============== The Wealth Method Backend ==============//");
console.log("");

require("dotenv").config();

const config = require("./config");
const redisClient = require("./redisClient/init");
const express = require("express");
const responseTime = require("response-time");
const http = require("http");

const app = express();
app.use(responseTime());
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));

// Set app root
app.locals.rootDir = __dirname;
global.approot = __dirname;

// Express middlewares (cors, helmet, etc.)
config.expressConfig(app, config.cfg);

// Attach all routes
require("./routes")(app);

module.exports = app;

global.appStarted = false;

const shouldListen = require.main === module && !process.env.VERCEL;

const startServer = () => {
  const server = http.createServer(app);

  server
    .listen(config.cfg.port, () => {
      global.appStarted = true;
      console.log(
        `✅  Wealth Method API running on port ${config.cfg.port} [${config.cfg.environment}]`
      );
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${config.cfg.port} already in use.`);
      } else {
        console.error("Server error:", err);
      }
    });
};

config.dbConfig(config.cfg, (error) => {
  if (error) {
    console.error("DB connection failed.", error);
    if (shouldListen) {
      process.exit(1);
    }
    return;
  }

  // Initialize Redis
  redisClient
    .init()
    .then(() => {
      if (global.appStarted) {
        console.log("Application already running. Skipping re-initialization.");
        return;
      }

      if (shouldListen) {
        startServer();
      }
    })
    .catch((err) => {
      console.error("Redis connection failed.", err);
      if (shouldListen) {
        process.exit(1);
      }
    });
});

