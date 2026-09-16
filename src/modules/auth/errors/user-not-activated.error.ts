import { ApplicationError } from "@/shared/errors/application-error.js";

export class UserNotActivatedError extends ApplicationError {
  readonly code = "USER_NOT_ACTIVATED"
  readonly statusCode = 403

  constructor(){
    super("Usuário não está ativo")
  }
}