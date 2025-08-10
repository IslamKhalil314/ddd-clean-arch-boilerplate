import { DomainEvent } from './domain-event';
import { Entity, EntityId } from './entity';

export abstract class AggregateRoot<T extends EntityId> extends Entity<T> {
  private readonly _events: DomainEvent<T>[] = [];

  get events(): DomainEvent<T>[] {
    return this._events;
  }

  addEvent(event: DomainEvent<T>): void {
    this._events.push(event);
  }

  clearEvents(): void {
    this._events.splice(0, this._events.length);
  }
}
