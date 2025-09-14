import { QueryHandler as QueryHandlerDecorator } from '../shared-kernel/infrastructure/cqrs/decorators/query.handler.decorator';
import { QueryHandler } from '../shared-kernel/application/cqrs/query.handler';
import { Query } from '../shared-kernel/application/cqrs/query';
import { Result } from '../shared-kernel/application/cqrs/result';
import { GetAllUsersQuery } from '../queries/get-all-users.query';
import { UserDto } from '../dto/user.dto';
import { CreateUserCommandHandler } from './create-user.handler';

@QueryHandlerDecorator(GetAllUsersQuery)
export class GetAllUsersQueryHandler
  implements QueryHandler<GetAllUsersQuery, UserDto[]>
{
  async execute(query: GetAllUsersQuery): Promise<Result<UserDto[]>> {
    try {
      let users = CreateUserCommandHandler.getUsers();

      // Apply pagination if provided
      if ((query as GetAllUsersQuery).offset !== undefined) {
        users = users.slice((query as GetAllUsersQuery).offset);
      }

      if ((query as GetAllUsersQuery).limit !== undefined) {
        users = users.slice(0, (query as GetAllUsersQuery).limit);
      }

      return Result.success(users);
    } catch (error) {
      return Result.fromError<UserDto[]>(error, 'GET_ALL_USERS_ERROR');
    }
  }
}
