export type UserParams = {
  id: string,
  telegramId: string,
  username: string,
  language: string,
  createdAt: Date,
  updatedAt: Date,
}

export class User {
  public id: string;
  private telegramId: string;
  private username: string;
  private language: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor (params: UserParams) {
    this.id = params.id;
    this.telegramId = params.telegramId;
    this.username = params.username;
    this.language = params.language;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  snapshot(): UserParams {
    return {
      id: this.id,
      telegramId: this.telegramId,
      username: this.username,
      language: this.language,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
