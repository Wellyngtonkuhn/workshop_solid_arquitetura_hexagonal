import { DrizzelUserRepository } from "../../resources/repositories/drizzle/UserRepository.js"
import { NotificationService } from "../services/Notification.service.js"
import { CreateUser } from "../useCases/create-user/CreateUser.js"


export function makeCreateUser() {

  const userRepository = new DrizzelUserRepository()

  const notificationService = new NotificationService()

  return new CreateUser(
    userRepository,
    notificationService
  )
}