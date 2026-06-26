import { ApplicationError } from "../../../shared/errors/application-error.js";

export class PhoneAlreadyExistsError extends ApplicationError {
  readonly code = "PHONE_ALREADY_EXISTS";

  readonly statusCode = 409;

  constructor() {
    super("Phone already exists");
  }
}
