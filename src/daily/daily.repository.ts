import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class DailyRepository {
  constructor(
    @InjectKnex() private readonly db: Knex,
  ) {}
  
  async findLastRewardForUser(
    userId: string,
  ) {
    return this.db('daily_reward')
      .where('userId', userId)
      .orderBy('createdAt', 'desc')
      .first();
  }
  
  async saveLastRewardForUser(
    userId: string,
  ) {
    return this.db('daily_reward')
      .insert({
        userId,
        createdAt: new Date(),
      });
  }
}
