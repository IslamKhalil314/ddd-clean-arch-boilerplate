import { CommandHandler as CommandHandlerDecorator } from '../shared-kernel/infrastructure/cqrs/decorators/command.handler.decorator';
import { CommandHandler } from '../shared-kernel/application/cqrs/command.handler';
import { Command } from '../shared-kernel/application/cqrs/command';
import { Result } from '../shared-kernel/application/cqrs/result';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserDto } from '../dto/user.dto';
import { v4 as uuidv4 } from 'uuid';

@CommandHandlerDecorator(CreateUserCommand)
export class CreateUserCommandHandler
  implements CommandHandler<CreateUserCommand, UserDto>
{
  // In a real application, this would be a database or repository
  private static users: UserDto[] = [];

  async execute(command: CreateUserCommand): Promise<Result<UserDto>> {
    try {
      // Validate email uniqueness (business logic example)
      const existingUser = CreateUserCommandHandler.users.find(
        (user) => user.email === command.email,
      );

      if (existingUser) {
        return Result.error<UserDto>(
          'User with this email already exists',
          'USER_EMAIL_EXISTS',
        );
      }

      // Create new user
      const newUser: UserDto = {
        id: uuidv4(),
        name: command.name,
        email: command.email,
        age: command.age,
        createdAt: new Date(),
      };

      // Save user (simulate database save)
      CreateUserCommandHandler.users.push(newUser);

      return Result.success(newUser);
    } catch (error) {
      return Result.fromError<UserDto>(error, 'CREATE_USER_ERROR');
    }
  }

  // Helper method for accessing users (for demo purposes)
  static getUsers(): UserDto[] {
    return [...this.users];
  }
}
