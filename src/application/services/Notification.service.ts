import { SendNotificationFactory } from "../factories/make-notification.factory.js"
import { NotificationChannel } from "../ports/notification-provider.js"

export class NotificationService {
  async send(channel: NotificationChannel, input: any) {
    try {
      const provider = SendNotificationFactory.create(channel)

      await provider.send(input)
      
    } catch (error) {
      console.error('Erro ao notificar pelo canal: ', channel)
    }
  }
}