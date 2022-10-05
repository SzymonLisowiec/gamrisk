import { Module } from '@nestjs/common';
import { JackpotService } from './jackpot.service';
import { JackpotController } from './jackpot.controller';
import { RoundRepository } from './round.repository';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    WalletModule,
  ],
  providers: [
    JackpotService,
    RoundRepository,
  ],
  controllers: [
    JackpotController,
  ],
})
export class JackpotModule {}
