import { InMemoryEventBus } from "../../../../shared/application/events/in-memory-event-bus.js";
import { JwtTokenProvider } from "../../../../shared/infrastructure/security/token/index.js";
import { DrizzelUserRepository } from "../../infrastructure/repositories/DrizzleUserRepository.js";
import { UserEmailConfirmedEvent } from "../events/user-email-confirmed.event.js";
import { CreateDefaultSettingsObserver } from "../observers/create-default-settings.observer.js";
import { SendWelcomeEmailObserver } from "../observers/send-welcome-email.observer.js";
import { UserConfirmEmail } from "../useCases/confirm-email/index.js";

export function makeConfirmUserEmail(){
  const userRepository = new DrizzelUserRepository()
  const tokenProvider = new JwtTokenProvider()
  const eventBus = new InMemoryEventBus()

  eventBus.register(
    UserEmailConfirmedEvent,
    new CreateDefaultSettingsObserver()
  )

  eventBus.register(
    UserEmailConfirmedEvent,
    new SendWelcomeEmailObserver()
  )

  return new UserConfirmEmail(
    userRepository,
    tokenProvider,
    eventBus
  )
}