import { Event } from "./event.js";

export interface Observer<T extends Event> {
  update(event: T): Promise<void>;
}
