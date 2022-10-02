import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { UserModule } from './user/user.module';
import KnexConfig from './knex/config';
import { WalletModule } from './wallet/wallet.module';
import { SpinModule } from './spin/spin.module';
import { DailyModule } from './daily/daily.module';

@Module({
  imports: [
    KnexModule.forRoot({
      config: KnexConfig,
    }),
    UserModule,
    WalletModule,
    SpinModule,
    TelegramModule,
    DailyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
