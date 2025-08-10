export abstract class Entity<T extends EntityId> {
  private readonly _id: T;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(id: T) {
    this._id = id;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): T {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  touch(): void {
    this._updatedAt = new Date();
  }

  equals(other: Entity<T>): boolean {
    if (!(other instanceof Entity)) {
      return false;
    }
    return this._id.equals(other._id);
  }
}

export abstract class EntityId {
  abstract equals(other: EntityId): boolean;
  abstract toString(): string;
  static generate(): EntityId {
    throw new Error('Not implemented');
  }
}
