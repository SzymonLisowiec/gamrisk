import { Module } from '@nestjs/common';
import { DailyService } from './daily.service';
import { DailyController } from './daily.controller';
import { WalletModule } from 'src/wallet/wallet.module';
import { DailyRepository } from './daily.repository';

@Module({
  imports: [WalletModule],
  providers: [
    DailyService,
    DailyRepository,
  ],
  controllers: [DailyController]
})
export class DailyModule {}
