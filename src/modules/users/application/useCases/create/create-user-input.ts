import { NotificationChannel } from "../../../../../shared/infrastructure/notifications/ports/notification-provider.js";

export interface CreateUserInputDTO {
  name: string;
  age: number;
  phoneNumber: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  preferredMarketingChannel: NotificationChannel
}