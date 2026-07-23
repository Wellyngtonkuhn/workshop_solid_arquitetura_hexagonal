import { UserRepository } from "../../../domain/repositories/user-repository.js";
import { TokenPayload, TokenProvider } from "../../../../../shared/application/ports/token-provider.js";
import { UserNotFound } from "../../../errors/user-not-found.error.js";
import { InvalidTokenError } from "../../../errors/invalid-token.error.js";
import { ExpiredTokenError } from "../../../errors/expired-token.error.js";
import { UserEmailConfirmedEvent } from "../../events/user-email-confirmed.event.js";
import { EventBus } from "../../../../../shared/application/events/event-bus.js";

export class UserConfirmEmail {
  constructor(
    private repository: UserRepository,
    private tokenProvider: TokenProvider,
    private eventBus: EventBus
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