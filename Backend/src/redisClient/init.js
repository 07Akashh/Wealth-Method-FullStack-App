// ======================== Redis Client Init ========================
const redis = require("redis");
const config = require("../config").cfg;
const appUtils = require("../utils/appUtils");

let client;

const init = () => {
  const { redis: r } = config;
  const redisUrl = `redis://${r.user}:${r.pass}@${r.server}:${r.port}`;
  
  client = redis.createClient({
    url: r.pass ? redisUrl : `redis://${r.server}:${r.port}`,
  });

  client.on("error", (err) => {
    appUtils.logError({ moduleName: "Redis", methodName: "init", err });
  });

  client.on("connect", () => {
    console.log("✅  Redis connected.");
  });

  return client.connect();
};

const setValue = (key, value, expiry = config.TOKEN_EXPIRATION_SEC) => {
  return client.set(key, value, {
    EX: expiry,
  });
};

const getValue = (key) => {
  return client.get(key);
};

const deleteValue = (key) => {
  return client.del(key);
};

// SADD/SMEMBERS for multiple sessions per user
const addToSet = (key, value) => {
  return client.sAdd(key, value);
};

const removeFromSet = (key, value) => {
  return client.sRem(key, value);
};

const getSetMembers = (key) => {
  return client.sMembers(key);
};

module.exports = {
  init,
  setValue,
  getValue,
  deleteValue,
  addToSet,
  removeFromSet,
  getSetMembers,
};
