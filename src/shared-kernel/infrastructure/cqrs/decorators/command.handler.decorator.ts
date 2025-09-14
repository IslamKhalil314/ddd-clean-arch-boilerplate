import { Injectable, SetMetadata, Type } from '@nestjs/common';
import { Command } from '../../../application/cqrs/command';

export const COMMAND_HANDLER_METADATA = 'CommandHandlerMetadata';

export function CommandHandler<T extends Command>(command: Type<T>) {
  return (target: any) => {
    SetMetadata(COMMAND_HANDLER_METADATA, command)(target);
    Injectable()(target);
  };
}
