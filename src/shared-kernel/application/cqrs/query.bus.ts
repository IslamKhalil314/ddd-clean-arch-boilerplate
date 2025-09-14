import { Type } from '@nestjs/common';
import { Query } from './query';
import { QueryHandler } from './query.handler';
import { Result } from './result';

export const QUERY_BUS = 'QueryBus';

export interface QueryBus {
  execute<TQuery extends Query, TResult>(
    query: TQuery,
  ): Promise<Result<TResult>>;
  registerHandler(
    query: Type<Query>,
    handler: Type<QueryHandler<Query, Result>>,
  ): void;
}
