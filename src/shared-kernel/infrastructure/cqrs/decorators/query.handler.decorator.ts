import { Query } from '../../../application/cqrs/query';
import { Injectable, SetMetadata, Type } from '@nestjs/common';

export const QUERY_HANDLER_METADATA = 'QueryHandlerMetadata';

export function QueryHandler<T extends Query>(query: Type<T>) {
  return (target: any) => {
    SetMetadata(QUERY_HANDLER_METADATA, query)(target);
    Injectable()(target);
  };
}
