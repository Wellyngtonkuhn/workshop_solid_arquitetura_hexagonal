import { Event } from "./event.js";
import { Observer } from "./observer.js";

export interface EventBus {
  register<T extends Event>(
    event: EventConstructor<T>,
    observer: Observer<T>
  ): void;

  publish<T extends Event>(
    event: T
  ): Promise<void>;
}

export type EventConstructor<T extends Event> = new (
  ...args: any[]
) => T;