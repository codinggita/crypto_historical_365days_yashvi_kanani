import { body } from "express-validator";
import validate from "../middlewares/validate.middleware.js";

export const registerValidator = () => {
  return [
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("fullName is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("fullName must be between 2 and 50 characters"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    validate,
  ];
};

export const loginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required"),
    validate,
  ];
};
