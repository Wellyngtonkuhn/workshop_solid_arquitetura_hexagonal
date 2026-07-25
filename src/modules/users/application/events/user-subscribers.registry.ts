import { EventBus } from "../../../../shared/application/events/event-bus.js";
import { CreateDefaultSettingsObserver } from "../observers/create-default-settings.observer.js";
import { SendWelcomeEmailObserver } from "../observers/send-welcome-email.observer.js";
import { UserEmailConfirmedEvent } from "./user-email-confirmed.event.js";

export function registerUserSubscribers (eventBus: EventBus){
  // Aqui você registra tudo que o módulo de usuários precisa ouvir
  eventBus.register(UserEmailConfirmedEvent, new CreateDefaultSettingsObserver());
  eventBus.register(UserEmailConfirmedEvent, new SendWelcomeEmailObserver());
  console.log('🎧 [Users Module] Observers registrados com sucesso.');
}