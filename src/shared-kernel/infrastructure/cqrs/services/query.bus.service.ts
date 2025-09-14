import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Query } from '../../../application/cqrs/query';
import { QueryBus } from '../../../application/cqrs/query.bus';
import { QueryHandler } from '../../../application/cqrs/query.handler';
import { Result } from '../../../application/cqrs/result';

@Injectable()
export class QueryBusService implements QueryBus {
  private readonly queryHandlers: Map<
    string,
    Type<QueryHandler<Query, unknown>>
  > = new Map();

  constructor(private readonly moduleRef: ModuleRef) {}
  registerHandler(
    query: Type<Query>,
    handler: Type<QueryHandler<Query, unknown>>,
  ): void {
    this.queryHandlers.set(query.name, handler);
  }
  async execute<TQuery extends Query, TResult>(
    query: TQuery,
  ): Promise<Result<TResult>> {
    const handlerType = this.queryHandlers.get(query.constructor.name);
    if (!handlerType) {
      return Result.error('Query handler not found', 'QUERY_HANDLER_NOT_FOUND');
    }
    try {
      const handler = this.moduleRef.get<QueryHandler<TQuery, TResult>>(
        handlerType,
        { strict: false },
      );
      const result: Result<TResult> = await handler.execute(query);
      return result;
    } catch (error) {
      return Result.error('Query handler not found', 'QUERY_HANDLER_NOT_FOUND');
    }
  }
}
