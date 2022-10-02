import { Module } from '@nestjs/common';
import { WalletModule } from 'src/wallet/wallet.module';
import { SpinService } from './spin.service';
import { SpinController } from './spin.controller';

@Module({
  imports: [
    WalletModule,
  ],
  providers: [
    SpinService,
  ],
  controllers: [
    SpinController,
  ],
})
export class SpinModule {}
