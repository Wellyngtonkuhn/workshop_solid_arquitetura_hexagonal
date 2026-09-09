import { InMemoryEventBus } from "../application/events/in-memory-event-bus.js";
import { db } from "../database/drizzle/client.js";
import { NotificationService } from "../infrastructure/notifications/Notification.service.js";
import { BcryptHashProvider } from "../infrastructure/security/hash/hashProvider.js";
import { JwtTokenProvider } from "../infrastructure/security/token/index.js";

const globalEventBus = new InMemoryEventBus()
const notificationService = new NotificationService();
const bcryptHashProvider = new BcryptHashProvider();
const jwtProvider = new JwtTokenProvider();

const database = db;

export {
  database,
  jwtProvider,
  bcryptHashProvider,
  notificationService,
  globalEventBus
}