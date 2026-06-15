import { NotificationProvider } from "../../application/ports/notification-provider.js";

export class TwilioSmsProvider implements NotificationProvider {
  async send(input: any): Promise<void> {
    console.log('SMS prodiver data: ', input)
  }
}