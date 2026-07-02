import { ApplicationError } from "../../../shared/errors/application-error.js";

export class UserCannotUpdateProfileError extends ApplicationError {
  readonly code = "USER_CANNOT_UPDATE";

  readonly statusCode = 403;

  constructor() {
    super("Usuário não pode atualizar o perfil");
  }
}
