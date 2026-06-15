import { NotificationProvider } from "../../application/ports/notification-provider.js"

export class FirebasePushProvider implements NotificationProvider {
  async send(input: any): Promise<void> {
    console.log('Firebase Push Provider input: ', input)
     // firebase.messaging().send(...)
  }
}