import { Controller } from '@nestjs/common';
import { OnTelegramCommand } from 'src/telegram/decorators/on-telegram-command.decorator';
import { NoMoneyException } from 'src/wallet/exception/no-money.exception';
import { SpinService } from './spin.service';

@Controller('spin')
export class SpinController {
  constructor(
    private readonly spinService: SpinService,
  ) {}
  
  @OnTelegramCommand('spin', 'Spinning')
  async spin(context: any) {
    const { update } = context;
    const { message } = update;
    
    try {
      await this.spinService.spin(context);
    } catch (error) {
      switch (error.constructor) {
        case NoMoneyException:
          context.telegram.sendMessage(
            message.chat.id,
            'No money!',
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
