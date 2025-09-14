import { Type } from '@nestjs/common';
import { Command } from './command';
import { CommandHandler } from './command.handler';
import { Result } from './result';

export const COMMAND_BUS = 'CommandBus';

export interface CommandBus {
  execute<TCommand extends Command, TResult>(
    command: TCommand,
  ): Promise<Result<TResult>>;
  registerHandler(
    command: Type<Command>,
    handler: Type<CommandHandler<Command, Result>>,
  ): void;
}
