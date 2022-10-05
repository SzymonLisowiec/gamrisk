export type RoundEntryParams = {
  id: string,
  userId: string,
  value: number,
  createdAt: Date,
};

export class RoundEntry {
  public id: string;
  private userId: string;
  private value: number;
  private createdAt: Date;

  constructor(
    params: RoundEntryParams,
  ) {
    this.id = params.id;
    this.userId = params.userId;
    this.value = params.value;
    this.createdAt = params.createdAt;
  }
  
  snapshot(): RoundEntryParams {
    return {
      id: this.id,
      userId: this.userId,
      value: this.value,
      createdAt: this.createdAt,
    };
  }
}
