import { ApplicationError } from "../../../shared/errors/application-error.js"

export class EmailAlreadyExistsError extends ApplicationError {

  readonly code = "EMAIL_ALREADY_EXISTS"

  readonly statusCode = 409

  constructor() {
    super("E-mail já cadastrado")
  }
}