// ======================== Redis Client Init ========================
const redis = require("redis");
const config = require("../config").cfg;
const appUtils = require("../utils/appUtils");

let client;
let connectPromise;

const createClient = () => {
  const { redis: r } = config;
  const redisUrl = `redis://${r.user}:${r.pass}@${r.server}:${r.port}`;

  if (client) {
    return client;
  }

  client = redis.createClient({
    url: r.pass ? redisUrl : `redis://${r.server}:${r.port}`,
  });

  client.on("error", (err) => {
    appUtils.logError({ moduleName: "Redis", methodName: "init", err });
  });

  client.on("connect", () => {
    console.log("✅  Redis connected.");
  });

  return client;
};

const init = () => {
  if (connectPromise) {
    return connectPromise;
  }

  const redisClient = createClient();
  connectPromise = redisClient.connect().catch((err) => {
    connectPromise = undefined;
    throw err;
  });

  return connectPromise;
};

const ensureClient = () => {
  if (client?.isOpen) {
    return Promise.resolve(client);
  }

  return init().then(() => client);
};

const setValue = (key, value, expiry = config.TOKEN_EXPIRATION_SEC) => {
  return ensureClient().then((redisInstance) =>
    redisInstance.set(key, value, {
      EX: expiry,
    })
  );
};

const getValue = (key) => {
  return ensureClient().then((redisInstance) => redisInstance.get(key));
};

const deleteValue = (key) => {
  return ensureClient().then((redisInstance) => redisInstance.del(key));
};

// SADD/SMEMBERS for multiple sessions per user
const addToSet = (key, value) => {
  return ensureClient().then((redisInstance) => redisInstance.sAdd(key, value));
};

const removeFromSet = (key, value) => {
  return ensureClient().then((redisInstance) => redisInstance.sRem(key, value));
};

const getSetMembers = (key) => {
  return ensureClient().then((redisInstance) => redisInstance.sMembers(key));
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
