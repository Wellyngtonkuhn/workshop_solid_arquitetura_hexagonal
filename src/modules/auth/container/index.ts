import { DrizzelUserRepository } from "@/modules/users/infrastructure/repositories/DrizzleUserRepository.js";
import { LoginUseCase } from "../application/useCases/login/index.js";
import { bcryptHashProvider, database, jwtProvider } from "@/shared/container/index.js";

const repository = new DrizzelUserRepository(database)

export function makeLogin(){
  return new LoginUseCase(
    repository,
    bcryptHashProvider,
    jwtProvider
  )
}