import { Event } from "./event.js";
import { EventBus, EventConstructor } from "./event-bus.js";
import { Observer } from "./observer.js";

export class InMemoryEventBus implements EventBus {

  private observers = new Map<EventConstructor<any>, Observer<any>[]>();

  register<T extends Event>(event: EventConstructor<T>, observer: Observer<T>): void {
    const observers = this.observers.get(event) ?? [];
    observers.push(observer);
    this.observers.set(event, observers);
  }

  async publish<T extends Event>(event: T): Promise<void> {
    const eventConstructor = event.constructor as EventConstructor<T>;
    const observers = this.observers.get(eventConstructor) ?? [];

    for (const observer of observers) {
      await observer.update(event);
    }
  }
}