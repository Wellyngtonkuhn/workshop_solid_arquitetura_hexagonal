import { ApplicationError } from "@/shared/errors/application-error.js";

export class InvalidCredentialsError extends ApplicationError {
  readonly code = "INVALID_CREDENTIALS_ERROR"
  readonly statusCode = 401

  constructor(){
    super("Credenciais inválidas")
  }
}