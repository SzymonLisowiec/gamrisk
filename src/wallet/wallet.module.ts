import { Module } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
  providers: [
    WalletService,
    WalletRepository,
  ],
  exports: [
    WalletService,
  ],
  controllers: [WalletController],
})
export class WalletModule {}
