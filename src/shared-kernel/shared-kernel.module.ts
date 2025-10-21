import { Inject, Module, Type } from '@nestjs/common';
import { CommandBusService } from './infrastructure/cqrs/services/command.bus.service';
import { QUERY_BUS, QueryBus } from './application/cqrs/query.bus';
import { QueryBusService } from './infrastructure/cqrs/services/query.bus.service';
import { COMMAND_BUS, CommandBus } from './application/cqrs/command.bus';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { Command } from './application/cqrs/command';
import { CommandHandler } from './application/cqrs/command.handler';
import { QueryHandler } from './application/cqrs/query.handler';
import { Result } from './application/cqrs/result';
import { COMMAND_HANDLER_METADATA } from './infrastructure/cqrs/decorators/command.handler.decorator';
import { QUERY_HANDLER_METADATA } from './infrastructure/cqrs/decorators/query.handler.decorator';
import { Query } from './application/cqrs/query';

@Module({
  imports: [DiscoveryModule],
  providers: [
    {
      provide: COMMAND_BUS,
      useClass: CommandBusService,
    },
    {
      provide: QUERY_BUS,
      useClass: QueryBusService,
    },
  ],
  exports: [COMMAND_BUS, QUERY_BUS],
})
export class SharedKernelModule {
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
