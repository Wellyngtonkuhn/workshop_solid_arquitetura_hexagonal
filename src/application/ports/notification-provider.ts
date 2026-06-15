export type NotificationChannel =   | "email"  | "sms"  | "push"  | "whatsapp"

export interface NotificationProvider {
  send(input: any): Promise<void>
}