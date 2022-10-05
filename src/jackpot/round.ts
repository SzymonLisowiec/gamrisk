import { v4 as UUIDv4 } from 'uuid';
import { RoundEntry, RoundEntryParams } from './round-entry';

export type RoundParams = {
  id: string,
  isEnded: boolean,
  createdAt: Date,
  updatedAt: Date,
  entries: RoundEntryParams[],
};

export class Round {
  public id: string;
  private isEnded: boolean;
  private createdAt: Date;
  private updatedAt: Date;
  private entries: RoundEntry[];
  
  constructor(
    params: RoundParams,
  ) {
    this.id = params.id;
    this.isEnded = params.isEnded;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.entries = params.entries.map((entryParams) => new RoundEntry(entryParams));
  }
  
  addEntry(
    userId: string,
    value: number,
  ) {
    this.entries.push(new RoundEntry({
      id: UUIDv4(),
      userId,
      value,
      createdAt: new Date(),
    }));
  }
  
  snapshot(): RoundParams {
    return {
      id: this.id,
      isEnded: this.isEnded,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      entries: this.entries.map((entry) => entry.snapshot()),
    };
  }
}
