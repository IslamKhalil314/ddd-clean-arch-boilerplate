import { Query } from '../shared-kernel/application/cqrs/query';

export interface GetAllUsersQueryPayload {
  // Could include pagination, filtering, etc.
  limit?: number;
  offset?: number;
}

export class GetAllUsersQuery extends Query {
  constructor(payload: GetAllUsersQueryPayload = {}) {
    super(payload);
  }

  get limit(): number | undefined {
    return this.payload.limit;
  }

  get offset(): number | undefined {
    return this.payload.offset;
  }
}
