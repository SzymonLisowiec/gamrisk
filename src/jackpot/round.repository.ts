import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { Round } from './round';

@Injectable()
export class RoundRepository {
  constructor(
    @InjectKnex() private readonly db: Knex,
  ) {}
  
  async findCurrentRound() {
    const params = await this.db('jackpot_round')
      .where('isEnded', false)
      .orderBy('createdAt', 'asc')
      .first();
    if (!params) return null;
    const entries = await this.db('jackpot_round_entry')
      .where('roundId', params.roundId);
    return new Round({
      ...params,
      entries,
    });
  }
  
  async save() {
    
  }
}
