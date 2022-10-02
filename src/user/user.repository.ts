import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { User } from './user';

@Injectable()
export class UserRepository {
  private tableName = 'user';

  constructor(
    @InjectKnex() private readonly db: Knex,
  ) {}

  async findOneByTelegramId(telegramId: string) {
    const params = await this.db(this.tableName)
      .where('telegramId', telegramId)
      .first();
    return params ? new User(params) : null;
  }
  
  async save(
    user: User,
    trx?: any,
  ) {
    const snapshot = user.snapshot();
    const query = this.db(this.tableName);
    if (snapshot.updatedAt) {
      query.where('id', snapshot.id)
      .update({
        username: snapshot.username,
        language: snapshot.language,
        updatedAt: snapshot.updatedAt,
      });
    } else {
      query.insert({
        id: snapshot.id,
        telegramId: snapshot.telegramId,
        username: snapshot.username,
        language: snapshot.language,
        createdAt: snapshot.createdAt,
        updatedAt: new Date(),
      });
    }
    if (trx) {
      query.transacting(trx);
    }
    await query;
  }
}
