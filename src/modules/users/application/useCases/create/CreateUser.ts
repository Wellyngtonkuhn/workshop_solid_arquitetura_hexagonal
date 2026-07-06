import { CreateUserInputDTO } from "./create-user-input.js";
import { CreateUserOutputDTO } from "./create-user-output.js";

import { HashProvider } from "../../ports/hash-provider.js";
import { UserRepository } from "../../../domain/repositories/user-repository.js";
import { User } from "../../../domain/entities/User.js";
import { PasswordDoNotMatchError } from "../../../errors/password-do-not-match.error.js";
import { EmailAlreadyExistsError } from "../../../errors/email-already-exists.error.js";
import { NotificationService } from "../../../../../shared/infrastructure/notifications/Notification.service.js";
import { NotificationChannel } from "../../../../../shared/infrastructure/notifications/ports/notification-provider.js";
import { TokenProvider } from "../../../../../shared/application/ports/token-provider.js";

export class CreateUser {
  // aqui é invertido a dependencia usando o D do SOLID, esse módulo de alto nível depende apenas da abstração do módulo de baixo nível
  constructor(
    private userRepository: UserRepository,
    private notificationService: NotificationService,
    private hashProvider: HashProvider,
    private tokenProvider: TokenProvider,
  ){}

  async execute(body: CreateUserInputDTO): Promise<CreateUserOutputDTO>{
    if (body.password !== body.passwordConfirmation) {
     throw new PasswordDoNotMatchError()
    }

    const existingUser = await this.userRepository.findByEmail(body.email)

    if (existingUser) {
      throw new EmailAlreadyExistsError()
    }

    const user = User.create({
      name: body.name,
      age: body.age,
      email: body.email,
      password: await this.hashProvider.hash(body.password),
      phoneNumber: body.phoneNumber,
      preferredMarketingChannel: body.preferredMarketingChannel,
    })

    const persistedUser = await this.userRepository.save(user)
    const userData = persistedUser.propsData

    const confirmationToken = this.tokenProvider.sign({ sub: userData.id!, purpose: 'email_confirmation' }, 60 * 48)

    await this.notificationService.send(userData.preferredMarketingChannel as NotificationChannel, confirmationToken)

    return {
      id: userData.id!,
      name: userData.name,
      age: userData.age,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      preferredMarketingChannel: userData.preferredMarketingChannel as NotificationChannel
    }
  }
}