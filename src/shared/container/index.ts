import { InMemoryEventBus } from "../application/events/in-memory-event-bus.js";
import { db } from "../database/drizzle/client.js";

export const globalEventBus = new InMemoryEventBus()

export const database = db;