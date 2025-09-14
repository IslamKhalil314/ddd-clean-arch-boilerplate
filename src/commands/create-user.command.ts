import { Command } from '../shared-kernel/application/cqrs/command';
import { CreateUserDto } from '../dto/user.dto';

export class CreateUserCommand extends Command {
  constructor(payload: CreateUserDto) {
    super(payload);
  }

  get name(): string {
    return this.payload.name;
  }

  get email(): string {
    return this.payload.email;
  }

  get age(): number {
    return this.payload.age;
  }
}
