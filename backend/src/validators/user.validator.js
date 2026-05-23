import { body, param } from "express-validator";
import validate from "../middlewares/validate.middleware.js";

/**
 * Validator for updating own profile (name, email, avatar)
 */
export const updateProfileValidator = () => [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("avatar")
    .optional()
    .trim()
    .isURL()
    .withMessage("Avatar must be a valid URL"),
  validate,
];

/**
 * Validator for changing own password
 */
export const changePasswordValidator = () => [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old password is required"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .custom((val, { req }) => {
      if (val === req.body.oldPassword) {
        throw new Error("New password must be different from old password");
      }
      return true;
    }),
  validate,
];

/**
 * Validator for admin updating user role
 */
export const updateRoleValidator = () => [
  param("id")
    .notEmpty()
    .withMessage("User ID param is required")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "user"])
    .withMessage("Role must be one of: admin, user"),
  validate,
];

/**
 * Validator for admin updating user active status
 */
export const updateStatusValidator = () => [
  param("id")
    .notEmpty()
    .withMessage("User ID param is required")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),
  body("isActive")
    .notEmpty()
    .withMessage("isActive field is required")
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
  validate,
];

/**
 * Validator for admin deleting a user
 */
export const deleteUserValidator = () => [
  param("id")
    .notEmpty()
    .withMessage("User ID param is required")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),
  validate,
];
