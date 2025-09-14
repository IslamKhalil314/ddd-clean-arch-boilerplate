import { QueryHandler as QueryHandlerDecorator } from '../shared-kernel/infrastructure/cqrs/decorators/query.handler.decorator';
import { QueryHandler } from '../shared-kernel/application/cqrs/query.handler';
import { Result } from '../shared-kernel/application/cqrs/result';
import { GetUserQuery } from '../queries/get-user.query';
import { UserDto } from '../dto/user.dto';
import { CreateUserCommandHandler } from './create-user.handler';

@QueryHandlerDecorator(GetUserQuery)
export class GetUserQueryHandler
  implements QueryHandler<GetUserQuery, UserDto>
{
  async execute(query: GetUserQuery): Promise<Result<UserDto>> {
    try {
      const users = CreateUserCommandHandler.getUsers();

      let foundUser: UserDto | undefined;

      if (query.userId) {
        foundUser = users.find((user) => user.id === query.userId);
      } else if (query.email) {
        foundUser = users.find((user) => user.email === query.email);
      }

      if (!foundUser) {
        return Result.error<UserDto>('User not found', 'USER_NOT_FOUND');
      }

      return Result.success(foundUser);
    } catch (error) {
      return Result.fromError<UserDto>(error, 'GET_USER_ERROR');
    }
  }
}
