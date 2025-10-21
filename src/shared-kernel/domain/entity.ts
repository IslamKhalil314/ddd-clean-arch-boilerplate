import { v4 as uuidv4 } from 'uuid';
export abstract class Entity<T extends EntityId<unknown>> {
  private readonly _id: T;
  private _createdAt: Date;
  private _updatedAt: Date;

  protected constructor(id: T) {
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

export abstract class EntityId<T> {
  protected constructor(public readonly value: T) {}
  equals(other: EntityId<T>): boolean {
    return this.value === other.value;
  }
  toString(): T {
    return this.value;
  }
  static generate() {
    return this.prototype.generate();
  }

  static from<V>(value: V): EntityId<V> {
    return this.prototype.from(value);
  }

  abstract from(value: T): EntityId<T>;

  abstract generate(): EntityId<T>;
}
