import { ApplicationError } from "../../../shared/errors/application-error.js";

export class ExpiredTokenError extends ApplicationError {
  readonly code = "EXPIRED_TOKEN"

  readonly statusCode = 401

  constructor() {
    super("Token expirado")
  }
}