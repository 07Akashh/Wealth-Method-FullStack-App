module.exports = {
  environment: "staging",
  TAG: "STG",
  port: process.env.PORT || 5000,
  isDev: false,
  mongo: {
    dbName: process.env.mongodbName,
    userName: process.env.mongouserName,
    Pass: process.env.mongopass,
    dbUrl: (userName, pass, db) => {
      if (userName && pass) {
        return `mongodb+srv://${userName}:${pass}@cluster.mongodb.net/${db}?retryWrites=true&w=majority`;
      }
      return process.env.MONGO_URI;
    },
  },
  redis: {
    server: process.env.redis_server,
    port: process.env.redis_port,
    user: process.env.redis_username,
    pass: process.env.redis_pass,
  },
  frontEndUrl: "/",
};
