const Session = require("./sessionModel");
const jwtHandler = require("../../jwtHandler");
const cusExc = require("../../customException");
const successMsg = require("../../success_msg.json");

const listSessions = (userId) => {
  return Session.find({ userId, isActive: true }).then((sessions) => sessions);
};

const revokeSession = (userId, sessionId) => {
  return Session.findOne({ jti: sessionId, userId }) // Use JTI for revocation flexibility
    .then((session) => {
      if (!session) throw cusExc.getCustomErrorException("Session not found.");
      return jwtHandler.revokeSession(userId, session.jti).then(() => {
        session.isActive = false;
        return session.save();
      });
    })
    .then(() => successMsg.session_revoked);
};

const revokeAllOthers = (userId, currentJti) => {
  return Session.find({ userId, jti: { $ne: currentJti }, isActive: true })
    .then((sessions) => {
      const jtis = sessions.map((s) => s.jti);
      const sessionIds = sessions.map((s) => s._id);
      const redisPromises = jtis.map((jti) => jwtHandler.revokeSession(userId, jti));
      return Promise.all(redisPromises).then(() => {
        return Session.updateMany({ _id: { $in: sessionIds } }, { isActive: false });
      });
    })
    .then(() => successMsg.logout_others);
};

module.exports = {
  listSessions,
  revokeSession,
  revokeAllOthers,
};
