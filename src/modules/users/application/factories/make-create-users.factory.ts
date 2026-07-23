import { NotificationService } from "../../../../shared/infrastructure/notifications/Notification.service.js"
import { BcryptHashProvider } from "../../../../shared/infrastructure/security/hash/hashProvider.js"
import { JwtTokenProvider } from "../../../../shared/infrastructure/security/token/index.js"
import { DrizzelUserRepository } from "../../infrastructure/repositories/DrizzleUserRepository.js"
import { CreateUser } from "../useCases/create/CreateUser.js"

export function makeCreateUser() {
  console.log("✔ CreateUser initialized");
  const userRepository = new DrizzelUserRepository()
  const notificationService = new NotificationService()
  const bcryptHashProvider = new BcryptHashProvider()
  const tokenProvider = new JwtTokenProvider()

  return new CreateUser(
    userRepository,
    notificationService,
    bcryptHashProvider,
    tokenProvider
  )
}