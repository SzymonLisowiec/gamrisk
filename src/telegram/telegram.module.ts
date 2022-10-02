import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { DiscoveryModule } from '@nestjs/core';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    DiscoveryModule,
    UserModule,
  ],
  providers: [TelegramService],
  controllers: [TelegramController],
  exports: [TelegramService],
})
export class TelegramModule {}
