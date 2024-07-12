import { CustomError } from "./custom-errors";

export class badRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, badRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
