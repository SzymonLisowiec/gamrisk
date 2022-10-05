import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';

@Module({
  controllers: [
    RankingController,
  ],
  providers: [],
})
export class RankingModule {}
