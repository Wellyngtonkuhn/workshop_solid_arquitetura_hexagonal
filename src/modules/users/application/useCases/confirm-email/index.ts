import { UserRepository } from "@/modules/users/domain/repositories/user-repository.js";
import { ExpiredTokenError } from "@/modules/users/errors/expired-token.error.js";
import { InvalidTokenError } from "@/modules/users/errors/invalid-token.error.js";
import { UserNotFound } from "@/modules/users/errors/user-not-found.error.js";
import { EventBus } from "@/shared/application/events/event-bus.js";
import { TokenPayload, TokenProvider } from "@/shared/application/ports/token-provider.js";
import { UserEmailConfirmedEvent } from "../../events/user-email-confirmed.event.js";

export class UserConfirmEmail {
  constructor(
    private readonly repository: UserRepository,
    private readonly tokenProvider: TokenProvider,
    private readonly eventBus: EventBus
  ){}

  async execute(token: string): Promise<void>{
    let payload: TokenPayload;
    try {
      payload = this.tokenProvider.verify(token);
    } catch (err: any) {
      if (err?.name === "TokenExpiredError") {
        throw new ExpiredTokenError();
      }

      throw new InvalidTokenError();
    }

    if (payload.purpose !== "email_confirmation") {
      throw new InvalidTokenError();
    }

    const user = await this.repository.findById(payload.sub)

    if(!user){
      throw new UserNotFound()
    }

    user.register()
    user.activate()

    await this.repository.update(user)

    this.eventBus.publish(new UserEmailConfirmedEvent(user))
  }
}