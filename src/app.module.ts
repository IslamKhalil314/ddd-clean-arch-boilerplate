import { AppController } from './app.controller';
import {
  COMMAND_BUS,
  CommandBus,
} from './shared-kernel/application/cqrs/command.bus';
import {
  QUERY_BUS,
  QueryBus,
} from './shared-kernel/application/cqrs/query.bus';
import { CommandBusService } from './shared-kernel/infrastructure/cqrs/services/command.bus.service';
import { QueryBusService } from './shared-kernel/infrastructure/cqrs/services/query.bus.service';
import { DiscoveryService } from '@nestjs/core';
import { COMMAND_HANDLER_METADATA } from './shared-kernel/infrastructure/cqrs/decorators/command.handler.decorator';
import { QUERY_HANDLER_METADATA } from './shared-kernel/infrastructure/cqrs/decorators/query.handler.decorator';
import { Command } from './shared-kernel/application/cqrs/command';

import { Query } from './shared-kernel/application/cqrs/query';
import { Result } from './shared-kernel/application/cqrs/result';
import { CommandHandler } from './shared-kernel/application/cqrs/command.handler';
import { QueryHandler } from './shared-kernel/application/cqrs/query.handler';
import { Inject, Module, Type } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

// Import handlers
import { CreateUserCommandHandler } from './handlers/create-user.handler';
import { GetUserQueryHandler } from './handlers/get-user.handler';
import { GetAllUsersQueryHandler } from './handlers/get-all-users.handler';

@Module({
  imports: [DiscoveryModule],
  controllers: [AppController],
  providers: [
    {
      provide: COMMAND_BUS,
      useClass: CommandBusService,
    },
    {
      provide: QUERY_BUS,
      useClass: QueryBusService,
    },
    // Register handlers
    CreateUserCommandHandler,
    GetUserQueryHandler,
    GetAllUsersQueryHandler,
  ],
})
export class AppModule {
  constructor(
    private readonly discoveryService: DiscoveryService,
    @Inject(COMMAND_BUS)
    private readonly commandBus: CommandBus,
    @Inject(QUERY_BUS)
    private readonly queryBus: QueryBus,
  ) {
    const commandHandlers = this.discoveryService
      .getProviders()
      .filter(
        (wrapper) =>
          wrapper.metatype &&
          Reflect.getMetadata(COMMAND_HANDLER_METADATA, wrapper.metatype),
      );

    console.log('commandHandlers', commandHandlers);
    const queryHandlers = this.discoveryService
      .getProviders()
      .filter(
        (wrapper) =>
          wrapper.metatype &&
          Reflect.getMetadata(QUERY_HANDLER_METADATA, wrapper.metatype),
      );
    commandHandlers.forEach((wrapper) => {
      const commandHandlerType: Type<CommandHandler<Command, Result>> =
        wrapper.metatype as Type<CommandHandler<Command, Result>>;
      const commandType: Type<Command> = Reflect.getMetadata(
        COMMAND_HANDLER_METADATA,
        commandHandlerType,
      );

      console.log('commandHandlerType', commandHandlerType);

      this.commandBus.registerHandler(commandType, commandHandlerType);
    });
    queryHandlers.forEach((wrapper) => {
      const queryHandlerType: Type<QueryHandler<Query, Result>> =
        wrapper.metatype as Type<QueryHandler<Query, Result>>;
      const queryType: Type<Query> = Reflect.getMetadata(
        QUERY_HANDLER_METADATA,
        queryHandlerType,
      );
      this.queryBus.registerHandler(queryType, queryHandlerType);
    });
  }
}
