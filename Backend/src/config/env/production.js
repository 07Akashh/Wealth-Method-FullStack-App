module.exports = {
  environment: "production",
  TAG: "PROD",
  port: process.env.PORT || 5000,
  isProd: true,
  mongo: {
    dbName: process.env.mongodbName,
    userName: process.env.mongouserName,
    Pass: process.env.mongopass,
    dbUrl: (userName, pass, db) => `mongodb+srv://${userName}:${pass}@cluster.mongodb.net/${db}?retryWrites=true&w=majority`,
  },
  redis: {
    server: process.env.redis_server,
    port: process.env.redis_port,
    user: process.env.redis_username,
    pass: process.env.redis_pass,
  },
  frontEndUrl: "/",
};
