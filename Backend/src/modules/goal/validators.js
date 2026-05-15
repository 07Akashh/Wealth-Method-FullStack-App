// ======================== Goal Validators ========================
const Joi = require("joi");
const cusExc = require("../../customException");

const goalSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().allow("").max(500).optional(),
  targetAmount: Joi.number().positive().required(),
  currentAmount: Joi.number().min(0).optional(),
  icon: Joi.string().optional(),
  color: Joi.string().optional(),
  targetDate: Joi.date().allow(null).optional(),
  priority: Joi.number().integer().min(1).optional(),
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
  validateGoal: validate(goalSchema),
};
