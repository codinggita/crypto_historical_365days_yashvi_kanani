const { body, query, param } = require("express-validator");
const validate = require("../middlewares/validate.middleware");

const createCoinValidator = () => {
  return [
    body("coinId")
      .trim()
      .notEmpty()
      .withMessage("coinId is required")
      .isString()
      .withMessage("coinId must be a string"),
    body("name")
      .trim()
      .notEmpty()
      .withMessage("name is required")
      .isString()
      .withMessage("name must be a string"),
    body("symbol")
      .trim()
      .notEmpty()
      .withMessage("symbol is required")
      .isString()
      .withMessage("symbol must be a string"),
    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isFloat({ min: 0 })
      .withMessage("price must be a positive number"),
    body("rank")
      .optional()
      .isInt({ min: 1 })
      .withMessage("rank must be a positive integer"),
    body("marketCap")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("marketCap must be a positive number"),
    body("volume")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("volume must be a positive number"),
    body("dailyReturn")
      .optional()
      .isFloat()
      .withMessage("dailyReturn must be a number"),
    body("volatility")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("volatility must be a positive number"),
    body("month")
      .optional()
      .isString()
      .withMessage("month must be a string"),
    validate,
  ];
};

const updateCoinValidator = () => {
  return [
    body("coinId")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("coinId cannot be empty")
      .isString()
      .withMessage("coinId must be a string"),
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("name cannot be empty")
      .isString()
      .withMessage("name must be a string"),
    body("symbol")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("symbol cannot be empty")
      .isString()
      .withMessage("symbol must be a string"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("price must be a positive number"),
    body("rank")
      .optional()
      .isInt({ min: 1 })
      .withMessage("rank must be a positive integer"),
    body("marketCap")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("marketCap must be a positive number"),
    body("volume")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("volume must be a positive number"),
    body("dailyReturn")
      .optional()
      .isFloat()
      .withMessage("dailyReturn must be a number"),
    body("volatility")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("volatility must be a positive number"),
    body("month")
      .optional()
      .isString()
      .withMessage("month must be a string"),
    validate,
  ];
};

const queryCoinValidator = () => {
  return [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("limit must be an integer between 1 and 100"),
    query("sortBy")
      .optional()
      .isString()
      .withMessage("sortBy must be a string"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("sortOrder must be either 'asc' or 'desc'"),
    query("symbol")
      .optional()
      .isString()
      .withMessage("symbol must be a string"),
    query("minPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("minPrice must be a positive number"),
    query("maxPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("maxPrice must be a positive number"),
    query("coinId")
      .optional()
      .isString()
      .withMessage("coinId must be a string"),
    validate,
  ];
};

const searchCoinValidator = () => {
  return [
    query("q")
      .trim()
      .notEmpty()
      .withMessage("Search query parameter 'q' is required")
      .isString()
      .withMessage("Search query must be a string"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("limit must be an integer between 1 and 100"),
    validate,
  ];
};

module.exports = {
  createCoinValidator,
  updateCoinValidator,
  queryCoinValidator,
  searchCoinValidator,
};
