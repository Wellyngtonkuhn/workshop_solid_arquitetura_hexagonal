import { BcryptHashProvider } from "../../../../shared/hash/hashProvider.js"
import { NotificationService } from "../../../../shared/notifications/Notification.service.js"
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