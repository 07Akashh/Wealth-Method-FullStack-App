// ======================== User Facade ========================
const userService = require("./service");
const appUtils = require("../../utils/appUtils");
const jwtHandler = require("../../jwtHandler");
const cusExc = require("../../customException");
const redisClient = require("../../redisClient/init");
const Session = require("./sessionModel");
const emailService = require("../../services/email");
const successMsg = require("../../success_msg.json");
const config = require("../../config").cfg;

const _getImgPath = (user) => {
  return user?.img ? config.uploadDir + "/" + user.img : "";
};

const loginMapping = (params) => ({
  accessToken: params.jwt,
  isTempPass: params.tempPassCond ? params.tempPassCond : false,
  profile: {
    firstname: params.user.firstname,
    lastname: params.user.lastname,
    name: `${params.user.firstname} ${params.user.lastname}`,
    email: params.user.email,
    phone: params.user.phone,
    img: _getImgPath(params.user),
    Id: params.user._id,
    role: params.type,
    preferredCurrency: params.user.preferredCurrency,
    privacyMode: params.user.privacyMode,
    biometricEnabled: params.user.biometricEnabled,
    requiresPasswordChange: params.tempPassCond ? params.tempPassCond : false,
  },
});

const _setRedisWithRes = (jwt, user, type, tempPassCond = undefined) => {
  const userIdString = user._id.toString();
  return redisClient.setValue(userIdString, JSON.stringify(jwt))
    .then(() => loginMapping({ user, jwt, tempPassCond, type }));
};

const buildUserTokenGenObj = (user, roleType) => {
  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    type: roleType,
    name: `${user.firstname} ${user.lastname}`,
    created: new Date(),
  };
};

const login = (loginInfo, deviceInfo = {}) => {
  return userService.getByEmail(loginInfo)
    .then((user) => {
      if (!user) throw cusExc.completeCustomException("usr_nt_exst");
      if (!user.status) throw cusExc.completeCustomException("inactive_user");

      const hash = appUtils.encryptHashPassword(loginInfo.pass, user.salt);
      const tempPassCond = user.tempPass && appUtils.checkWithHash(loginInfo.pass, user.tempPass);

      if (hash === user.hash || tempPassCond) {
        const roleType = user.role === 1 ? "superadmin" : "user";
        const tokenObj = buildUserTokenGenObj(user, roleType);
        const tokenData = jwtHandler.generateToken(tokenObj);

        user.lastLogin = new Date();
        return user.save()
          .then(() => {
            const redisKey = `user_sessions:${user._id}`;
            return Promise.all([
              redisClient.addToSet(redisKey, tokenData.jti),
              new Session({
                userId: user._id,
                jti: tokenData.jti,
                deviceInfo: deviceInfo,
                deviceName: deviceInfo.deviceName || deviceInfo.browser || "Unknown Device",
              }).save()
            ]);
          })
          .then(() => _setRedisWithRes(tokenData.token, user, roleType, tempPassCond));
      } else {
        throw cusExc.completeCustomException("invalid_credentials");
      }
    });
};

const signup = (userData) => {
  let savedUserRecord;
  return userService.getByEmail({ email: userData.email })
    .then((user) => {
      if (user) throw cusExc.completeCustomException("usr_alrdy_exst");

      // FORCE temporary password flow: Ignore any provided password
      const tempPass = appUtils.genRandStr(7);
      
      // We generate a random salt/hash for the 'hash' field to ensure it's not empty, 
      // but the user MUST login via tempPass first.
      const placeholderPass = appUtils.genRandStr(15); 
      const pwdInfo = appUtils.generateSaltAndHashForPassword(placeholderPass);
      
      const newUser = { 
        ...userData, 
        ...pwdInfo, 
        tempPass: appUtils.genrateOnlyHash(tempPass), // Store hashed temp pass
        status: true, 
        isVerified: true 
      };

      // Remove password if it was passed in userData to prevent accidental override
      delete newUser.password;

      return userService.insertOne(newUser)
        .then((newUserRecord) => {
          savedUserRecord = newUserRecord;
          return emailService.sendMail({
            to: savedUserRecord.email,
            subject: "Welcome to The Wealth Method",
            template: "welcome.html",
            data: { 
              firstname: savedUserRecord.firstname, 
              tempPass: tempPass 
            }
          });
        })
        .then(() => successMsg.user_create)
        .catch((err) => {
          if (savedUserRecord) {
            return userService.deleteById(savedUserRecord._id).then(() => {
              throw cusExc.getCustomErrorException("Failed to send welcome email. Account creation rolled back.");
            });
          }
          throw err;
        });
    });
};

const forgotPass = (email) => {
  const tkn = appUtils.genRandStr(5);
  return userService.getByEmail({ email, isDeleted: false })
    .then((user) => {
      if (!user) throw cusExc.completeCustomException("usr_nt_exst");
      const otp = appUtils.base64En(tkn);
      return emailService.sendMail({
        to: user.email, 
        subject: "Password Reset Request", 
        template: "forgotPass.html", 
        data: { 
          otp,
          name: `${user.firstname} ${user.lastname}`
        }
      });
    })
    .then(() => userService.updateToken({ email, tkn }))
    .then(() => successMsg.otp_sent)
    .catch((err) => {
      if (err.moduleName === "EmailService" || err.code === "ECONNREFUSED") {
        throw cusExc.getCustomErrorException("Unable to send reset email at this time.");
      }
      throw err;
    });
};

const resetPass = (info) => {
  const decodedTkn = appUtils.base64De(info.one_time_pass);
  return userService.getByTkn({ tkn: decodedTkn })
    .then((user) => {
      if (!user) throw cusExc.getCustomErrorException("Invalid or expired reset token.");
      if (!appUtils.withinDay(user.frgt_pass.tknTime)) throw cusExc.completeCustomException("link_exp");

      const pwdInfo = appUtils.generateSaltAndHashForPassword(info.new_pass);
      return userService.findByIdAndUpdate(user._id, { ...pwdInfo, frgt_pass: {}, lastPassChnage: new Date() });
    })
    .then(() => successMsg.pass_reset);
};

const getProfile = (userId) => {
  return userService.getById(userId).then((user) => {
    if (!user) throw cusExc.completeCustomException("usr_nt_exst");
    const sanitized = appUtils.sanitizeUser(user);
    delete sanitized.salt; delete sanitized.hash;
    sanitized.requiresPasswordChange = !!user.tempPass;
    return sanitized;
  });
};

const updateProfile = (userId, updateData) => {
  return userService.findByIdAndUpdate(userId, updateData, { new: true }).then((user) => {
    if (!user) throw cusExc.completeCustomException("usr_nt_exst");
    const sanitized = appUtils.sanitizeUser(user);
    delete sanitized.salt; delete sanitized.hash;
    sanitized.requiresPasswordChange = !!user.tempPass;
    return sanitized;
  }).then(sanitized => ({ ...successMsg.user_update, profile: sanitized }));
};

const changePassword = (userId, oldPass, newPass) => {
  return userService.getById(userId, "+salt +hash +tempPass")
    .then((user) => {
      if (!user) throw cusExc.completeCustomException("usr_nt_exst");

      const hash = appUtils.encryptHashPassword(oldPass, user.salt);
      const tempPassCond = user.tempPass && appUtils.checkWithHash(oldPass, user.tempPass);

      if (hash === user.hash || tempPassCond) {
        const pwdInfo = appUtils.generateSaltAndHashForPassword(newPass);
        const update = {
          ...pwdInfo,
          tempPass: "", // Clear temp pass if it existed
          lastPassChnage: new Date(),
        };
        return userService.findByIdAndUpdate(userId, update);
      } else {
        throw cusExc.getCustomErrorException("Old password incorrect.");
      }
    })
    .then(() => successMsg.pass_reset);
};

module.exports = { login, signup, forgotPass, resetPass, getProfile, updateProfile, changePassword };
