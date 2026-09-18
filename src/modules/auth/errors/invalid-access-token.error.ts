import { ApplicationError } from "@/shared/errors/application-error.js";

export class InvalidAccessTokenError extends ApplicationError {
  readonly code = "INVALID_ACCESS_TOKEN"
  readonly statusCode = 401

  constructor(){
    super("Token de acesso inválido")
  }
}