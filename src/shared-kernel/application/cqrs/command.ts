import { v4 as uuidv4 } from 'uuid';

export abstract class Command {
  public readonly commandId: string;
  constructor(public readonly payload: any) {
    this.commandId = uuidv4();
  }
}
