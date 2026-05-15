// ======================== User Service ========================
const User = require("./model");
const baseDao = require("../../baseDao");

module.exports = {
  ...baseDao(User),
  
  getByEmail: (info) => {
    const query = { isDeleted: false };
    if (info.email) {
      query.$or = [{ email: info.email }, { phone: info.email }];
    } else if (info.phone) {
      query.phone = info.phone;
    }
    return User.findOne(query);
  },
  
  updateToken: (info) => {
    const update = {
      frgt_pass: {
        tkn: info.tkn,
        tknTime: new Date(),
      },
    };
    return User.findOneAndUpdate({ email: info.email, isDeleted: false }, update, { new: true });
  },
  
  getByTkn: (info) => User.findOne({ "frgt_pass.tkn": info.tkn, isDeleted: false }),
};
