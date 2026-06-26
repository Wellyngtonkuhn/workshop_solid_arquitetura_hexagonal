import { ApplicationError } from "../../../shared/errors/application-error.js"

export class PasswordDoNotMatchError extends ApplicationError {

  readonly code = "PASSWORDS_DO_NOT_MATCH"

  readonly statusCode = 400

  constructor() {
    super("Passwords do not match")
  }

}