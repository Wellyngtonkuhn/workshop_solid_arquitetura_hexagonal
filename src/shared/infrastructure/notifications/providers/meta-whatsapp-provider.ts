import { NotificationProvider } from "../ports/notification-provider.js";

export class MetaWhatsAppProvider implements NotificationProvider {
  async send(input: any): Promise<void> {
    console.log('Meta provider input: ', input)
    // chamada para API da Meta
  }
}