export abstract class DomainEvent<T> {
  public readonly timestamp: Date;
  public readonly payload: T;
  public readonly aggregateId: string;
  public readonly eventId: string;
  public readonly eventName: string;
}
