import { NotificationChannel, NotificationProvider } from "../ports/notification-provider.js";
import { FirebasePushProvider } from "../providers/firebase-push-provider.js";
import { MetaWhatsAppProvider } from "../providers/meta-whatsapp-provider.js";
import { SendGridProvider } from "../providers/sendgrid-provider.js";
import { TwilioSmsProvider } from "../providers/twilio-sms-provider.js";

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
