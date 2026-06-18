import { FirebasePushProvider } from "../../resources/notifications/firebase-push-provider.js";
import { MetaWhatsAppProvider } from "../../resources/notifications/meta-whatsapp-provider.js";
import { SendGridProvider } from "../../resources/notifications/sendgrid-provider.js";
import { TwilioSmsProvider } from "../../resources/notifications/twilio-sms-provider.js";
import { NotificationChannel, NotificationProvider } from "../ports/notification-provider.js";

export class SendNotificationFactory {
  static create(channel: NotificationChannel): NotificationProvider {
    switch (channel) {
      case "email":
        return new SendGridProvider();
      case "sms":
        return new TwilioSmsProvider();
      case "push":
        return new FirebasePushProvider();
      case "whatsapp":
        return new MetaWhatsAppProvider();
      default:
        throw new Error("Invalid channel");
    }
  }
}
