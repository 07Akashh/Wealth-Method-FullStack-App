// ======================== Transaction Validators ========================
const Joi = require("joi");
const cusExc = require("../../customException");
const constant = require("../../constant");

const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid(...constant.TRANSACTION_TYPES).required(),
  category: Joi.string().required(),
  date: Joi.date().required(),
  note: Joi.string().allow("").max(500).optional(),
  receipt: Joi.string().allow(null, "").optional(),
  currency: Joi.string().valid(...constant.CURRENCIES).optional(),
});

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const msg = error.details.map((d) => d.message).join(", ");
      throw cusExc.validationErrors({ message: msg });
    }
    req.body = value;
    next();
  };
}

module.exports = {
  validateTransaction: validate(transactionSchema),
};
