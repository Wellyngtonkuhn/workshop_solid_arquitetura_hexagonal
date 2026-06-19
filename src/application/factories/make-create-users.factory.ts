import { BcryptHashProvider } from "../../resources/hash/HashProvider.js"
import { DrizzelUserRepository } from "../../resources/repositories/drizzle/UserRepository.js"
import { NotificationService } from "../services/Notification.service.js"
import { CreateUser } from "../useCases/create-user/CreateUser.js"

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