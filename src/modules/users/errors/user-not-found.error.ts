import { ApplicationError } from "../../../shared/errors/application-error.js";

export class UserNotFound extends ApplicationError {
  readonly code = "USER_NOT_FOUND"

  readonly statusCode = 404

  constructor() {
    super("Usuário não encontrado")
  }
}