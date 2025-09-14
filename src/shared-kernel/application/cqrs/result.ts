export class Result<T = void> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly data: T | null,
    public readonly error: string | null,
    public readonly errorCode: string | null,
  ) {}

  static success<T>(data: T): Result<T> {
    return new Result<T>(true, data, null, null);
  }

  static error<T>(error: string, errorCode: string): Result<T> {
    return new Result<T>(false, null, error, errorCode);
  }

  static fromError<T>(error: Error, errorCode?: string): Result<T> {
    return new Result<T>(false, null, error.message, errorCode ?? null);
  }

  get isFailure(): boolean {
    return !this.isSuccess;
  }
}
