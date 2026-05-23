import { body, query } from "express-validator";
import validate from "../middlewares/validate.middleware.js";

export const createCoinValidator = () => {
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
    body("circulatingSupply")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("circulatingSupply must be a positive number"),
    body("totalSupply")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("totalSupply must be a positive number"),
    body("maxSupply")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("maxSupply must be a positive number"),
    body("category")
      .optional()
      .isString()
      .withMessage("category must be a string"),
    body("image")
      .optional()
      .isString()
      .withMessage("image must be a string"),
    body("marketStatus")
      .optional()
      .isString()
      .withMessage("marketStatus must be a string"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("tags must be an array of strings"),
    body("timestamp")
      .optional()
      .isISO8601()
      .withMessage("timestamp must be a valid date"),
    validate,
  ];
};

export const updateCoinValidator = () => {
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
    body("circulatingSupply")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("circulatingSupply must be a positive number"),
    body("totalSupply")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("totalSupply must be a positive number"),
    body("maxSupply")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("maxSupply must be a positive number"),
    body("category")
      .optional()
      .isString()
      .withMessage("category must be a string"),
    body("image")
      .optional()
      .isString()
      .withMessage("image must be a string"),
    body("marketStatus")
      .optional()
      .isString()
      .withMessage("marketStatus must be a string"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("tags must be an array of strings"),
    body("timestamp")
      .optional()
      .isISO8601()
      .withMessage("timestamp must be a valid date"),
    validate,
  ];
};

export const queryCoinValidator = () => {
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
    query("q")
      .optional()
      .isString()
      .withMessage("search query q must be a string"),
    query("category")
      .optional()
      .isString()
      .withMessage("category filter must be a string"),
    query("marketStatus")
      .optional()
      .isString()
      .withMessage("marketStatus filter must be a string"),
    query("rank")
      .optional()
      .isInt({ min: 1 })
      .withMessage("rank filter must be a positive integer"),
    query("minVolume")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("minVolume filter must be a positive number"),
    query("maxVolume")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("maxVolume filter must be a positive number"),
    query("minMarketCap")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("minMarketCap filter must be a positive number"),
    query("maxMarketCap")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("maxMarketCap filter must be a positive number"),
    validate,
  ];
};

export const searchCoinValidator = () => {
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
