import { Observer } from "../../../../shared/application/events/observer.js";
import { UserEmailConfirmedEvent } from "../events/user-email-confirmed.event.js";

export class CreateDefaultSettingsObserver implements Observer<UserEmailConfirmedEvent> {
  constructor(){}

  async update(event: UserEmailConfirmedEvent): Promise<void> {
    console.log('>> CreateDefaultSettingsObserver user name:', event.user.propsData.name)
  }
}