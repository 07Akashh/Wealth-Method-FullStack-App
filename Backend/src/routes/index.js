// ======================== Routes Index ========================
const transactionRoutes = require("../modules/transaction/route");
const goalRoutes = require("../modules/goal/route");
const userRoutes = require("../modules/user/route");
const { basicAuth } = require("../middleware");

module.exports = function (app) {
  app.use("/api/v1", basicAuth.basicAuthentication);
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/transaction", transactionRoutes);
  app.use("/api/v1/goal", goalRoutes);

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", timestamp: new Date() });
  });

  app.get("/", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Wealth Method API</title>
      </head>
      <body>
          <div class="container">
              <h1>The Wealth Method API</h1>
              <p>Status: Operational</p>
              <p>v1.0.0</p>
          </div>
      </body>
      </html>
    `);
  });

  // 404 & Error Handler
  const resHndlr = require("../responseHandler");
  app.use(resHndlr.defaultRoute);
  app.use(resHndlr.handleError);
};
