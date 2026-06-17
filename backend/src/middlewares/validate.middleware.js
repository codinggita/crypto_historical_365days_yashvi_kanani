import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

const validate = (req, res, next) => {
  console.log("Request Body:", req.body);
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  console.log("Validation Errors:", errors.array());

  const extractedErrors = errors.array().map((err) => err.msg);

  next(new ApiError(422, "Validation failed", extractedErrors));
};

export default validate;
