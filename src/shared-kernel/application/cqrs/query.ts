import { v4 as uuidv4 } from 'uuid';

export abstract class Query {
  public readonly queryId: string;
  constructor(public readonly payload: any) {
    this.queryId = uuidv4();
  }
}
