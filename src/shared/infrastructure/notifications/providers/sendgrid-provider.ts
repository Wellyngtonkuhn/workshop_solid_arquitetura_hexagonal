import { NotificationProvider } from "../ports/notification-provider.js";

export class SendGridProvider implements NotificationProvider {
  async send(input: any): Promise<void> {
    console.log('Sendgrid provider input: ', input)
  }
}