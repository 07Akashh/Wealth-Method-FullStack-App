// ======================== Logger ========================
const bunyan = require("bunyan");

const logger = bunyan.createLogger({
  name: "wealth-method-api",
  streams: [
    {
      level: "info",
      stream: process.stdout,
    },
    {
      level: "error",
      path: "app.log",
    },
  ],
});

module.exports = { logger };
