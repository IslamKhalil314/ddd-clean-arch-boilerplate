import { Query } from './query';
import { Result } from './result';

export interface QueryHandler<TQuery extends Query, TResult> {
  execute(query: TQuery): Promise<Result<TResult>>;
}
