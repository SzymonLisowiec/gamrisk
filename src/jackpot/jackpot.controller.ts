import { Controller } from '@nestjs/common';
import { OnTelegramCommand } from 'src/telegram/decorators/on-telegram-command.decorator';
import { JackpotService } from './jackpot.service';

@Controller('jackpot')
export class JackpotController {
  constructor(
    private readonly jackpotService: JackpotService,
  ) {}

  @OnTelegramCommand('jackpot', 'Jackpot')
  async jackpot(
    context: any,
  ) {
    const { update } = context;
    const { message } = update;
    
    const value = +message.text.split(/\s/)?.[1] || 0;
    
    if (value > 0) {
      await this.jackpotService.join(context.state.userId, value);
    }
  }
}
