import { NotificationService } from "../../../../shared/infrastructure/notifications/Notification.service.js"
import { BcryptHashProvider } from "../../../../shared/infrastructure/security/hash/hashProvider.js"
import { DrizzelUserRepository } from "../../infrastructure/repositories/DrizzleUserRepository.js"
import { CreateUser } from "../useCases/create/CreateUser.js"

export function makeCreateUser() {
  const userRepository = new DrizzelUserRepository()
  const notificationService = new NotificationService()
  const bcryptHashProvider = new BcryptHashProvider()

  return new CreateUser(
    userRepository,
    notificationService,
    bcryptHashProvider
  )
}