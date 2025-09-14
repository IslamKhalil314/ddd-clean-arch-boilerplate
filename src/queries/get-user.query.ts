import { Query } from '../shared-kernel/application/cqrs/query';

export interface GetUserQueryPayload {
  userId?: string;
  email?: string;
}

export class GetUserQuery extends Query {
  constructor(payload: GetUserQueryPayload) {
    super(payload);
  }

  get userId(): string | undefined {
    return this.payload.userId;
  }

  get email(): string | undefined {
    return this.payload.email;
  }
}
