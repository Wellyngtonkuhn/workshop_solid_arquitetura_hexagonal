import { ApplicationError } from "../../../shared/errors/application-error.js";

export class InvalidTokenError extends ApplicationError {
  readonly code = "INVALID_TOKEN"

  readonly statusCode = 401

  constructor() {
    super("Token inválido")
  }
}