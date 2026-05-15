// ======================== Constants ========================
const STATUS_CODE = { ERROR: 400, SUCCESS: 200 };

const ROLES = {
  ADMIN: 1,
  USER: 2,
};

const DB_MODEL_REF = {
  USER: "User",
  TRANSACTION: "Transaction",
  GOAL: "Goal",
  BUDGET: "Budget",
};

const TRANSACTION_TYPES = ["income", "expense"];

const EXPENSE_CATEGORIES = [
  "Food & Drink",
  "Travel",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Housing",
  "Insurance",
  "Investment",
  "Other",
];

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Dividend",
  "Rental",
  "Business",
  "Gift",
  "Refund",
  "Other",
];

const CURRENCIES = [
  "INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "SGD", "AED", "CHF",
];

const MESSAGES = {
  KEY_EMPTY_INVALID: "{{key}} should not be empty or invalid",
  INVAILD_EMAIL: "Email is invalid",
};

module.exports = Object.freeze({
  STATUS_CODE,
  ROLES,
  DB_MODEL_REF,
  TRANSACTION_TYPES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CURRENCIES,
  MESSAGES,
});
