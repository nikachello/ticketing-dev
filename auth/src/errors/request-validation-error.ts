import { ValidationError } from "express-validator";
import { CustomError } from "./custom-errors";

export class RequestValidationError extends CustomError implements CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Error");

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg };
    });
  }
}
