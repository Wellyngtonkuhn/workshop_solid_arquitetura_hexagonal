import { JwtTokenProvider } from "../../../../shared/infrastructure/security/token/index.js";
import { DrizzelUserRepository } from "../../infrastructure/repositories/DrizzleUserRepository.js";
import { UserConfirmEmail } from "../useCases/confirm-email/index.js";

export function makeConfirmUserEmail(){
  const userRepository = new DrizzelUserRepository()
  const tokenProvider = new JwtTokenProvider()

  return new UserConfirmEmail(
    userRepository,
    tokenProvider
  )
}