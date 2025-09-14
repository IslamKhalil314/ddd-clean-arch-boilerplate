import { Command } from './command';
import { Result } from './result';
export interface CommandHandler<TCommand extends Command, TResult> {
  execute(command: TCommand): Promise<Result<TResult>>;
}
