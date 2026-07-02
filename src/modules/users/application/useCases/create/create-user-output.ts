import { NotificationChannel } from "../../../../../shared/notifications/ports/notification-provider.js"

export interface CreateUserOutputDTO {
  id: string
  name: string
  age: number
  email: string
  phoneNumber: string
  preferredMarketingChannel: NotificationChannel
}