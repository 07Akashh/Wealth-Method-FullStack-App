// ======================== Goal Service ========================
const Goal = require("./model");
const baseDao = require("../../baseDao");

module.exports = {
  ...baseDao(Goal),
  // Custom goal logic (e.g. streak updates)
};
