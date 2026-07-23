import { Observer } from "../../../../shared/application/events/observer.js";
import { UserEmailConfirmedEvent } from "../events/user-email-confirmed.event.js";

export class SendWelcomeEmailObserver implements Observer<UserEmailConfirmedEvent> {
  constructor(){}

  async update(event: UserEmailConfirmedEvent): Promise<void> {
    console.log('>> SendWelcomeEmailObserver user name:', event.user.propsData.name)
  }
}