import { UserRepository } from "../../../domain/repositories/user-repository.js";
import { PasswordDoNotMatchError, UserCreationError } from "../../errors/index.js";
import bcrypt from "bcrypt"
import { NotificationService } from "../../services/Notification.service.js";
import { CreateUserInputDTO } from "./create-user-input.js";
import { CreateUserOutputDTO } from "./create-user-output.js";
import { NotificationChannel } from "../../ports/notification-provider.js";
import { User } from "../../../domain/entities/User.js";

export class CreateUser {
  // aqui é invertido a dependencia usando o D do SOLID, esse módulo de alto nível depende apenas da abstração do módulo de baixo nível
  constructor(
    private userRepository: UserRepository,
    private notificationService: NotificationService
  ){}

  async execute(body: CreateUserInputDTO): Promise<CreateUserOutputDTO>{
    if (body.password !== body.passwordConfirmation) {
     throw new PasswordDoNotMatchError()
    }

    const existingUser = await this.userRepository.findByEmail(body.email)

    if (existingUser) {
      throw new UserCreationError()
    }

    const user = User.create({
      name: body.name,
      age: body.age,
      email: body.email,
      password: await bcrypt.hash(body.password, 10),
      phoneNumber: body.phoneNumber,
      preferredMarketingChannel: body.preferredMarketingChannel,
    })

    const persistedUser = await this.userRepository.createUser(user)

    if (!persistedUser) {
      throw new UserCreationError()
    }
    
    await this.notificationService.send(persistedUser.propsData.preferredMarketingChannel as NotificationChannel, 'payload teste')

    return {
      id: persistedUser.propsData.id!,
      name: persistedUser.propsData.name,
      age: persistedUser.propsData.age,
      email: persistedUser.propsData.email,
      phoneNumber: persistedUser.propsData.phoneNumber,
      preferredMarketingChannel: persistedUser.propsData.preferredMarketingChannel
    }
  }
}