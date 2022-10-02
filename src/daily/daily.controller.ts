import { Controller } from '@nestjs/common';
import { OnTelegramCommand } from 'src/telegram/decorators/on-telegram-command.decorator';
import { DailyService } from './daily.service';
import { AlreadyRedeemedException } from './exceptions/already-redeemed.exception';

@Controller('daily')
export class DailyController {
  constructor(
    private readonly dailyService: DailyService,
  ) {}

  @OnTelegramCommand('daily', 'Redeem daily reward')
  async daily(context: any) {
    const { update } = context;
    const { message } = update;
    
    try {
      const value = await this.dailyService.redeem(context.state.userId);
    
      context.telegram.sendMessage(
        message.chat.id,
        `You got ${value} coins! 🎉`,
        {
          reply_to_message_id: message.message_id,
        },
      );
    } catch (error) {
      switch (error.constructor) {
        case AlreadyRedeemedException:
          context.telegram.sendMessage(
            message.chat.id,
            'Back tomorrow!',
            {
              reply_to_message_id: message.message_id,
            },
          );
          break;
          
        default:
          throw error;
      }
    }
  }
}
