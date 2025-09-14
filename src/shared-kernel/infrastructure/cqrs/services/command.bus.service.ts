import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Command } from '../../../application/cqrs/command';
import { CommandBus } from '../../../application/cqrs/command.bus';
import { CommandHandler } from '../../../application/cqrs/command.handler';
import { Result } from '../../../application/cqrs/result';

@Injectable()
export class CommandBusService implements CommandBus {
  private readonly commandHandlers: Map<
    string,
    Type<CommandHandler<Command, unknown>>
  > = new Map();

  constructor(private readonly moduleRef: ModuleRef) {}
  registerHandler(
    command: Type<Command>,
    handler: Type<CommandHandler<Command, unknown>>,
  ): void {
    this.commandHandlers.set(command.name, handler);
  }

  async execute<TCommand extends Command, TResult>(
    command: TCommand,
  ): Promise<Result<TResult>> {
    const handlerType = this.commandHandlers.get(command.constructor.name);
    if (!handlerType) {
      return Result.error(
        'Command handler not found',
        'COMMAND_HANDLER_NOT_FOUND',
      );
    }

    try {
      const handler = this.moduleRef.get<CommandHandler<TCommand, TResult>>(
        handlerType,
        { strict: false },
      );
      const result = await handler.execute(command);
      return result;
    } catch (error) {
      return Result.error(
        'Command handler not found',
        'COMMAND_HANDLER_NOT_FOUND',
      );
    }
  }
}
