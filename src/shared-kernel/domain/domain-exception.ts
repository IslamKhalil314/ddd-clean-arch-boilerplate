export abstract class DomainException extends Error {
  public abstract readonly errorCode: string;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
