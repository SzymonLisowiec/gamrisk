import { Controller } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { OnTelegramCommand } from 'src/telegram/decorators/on-telegram-command.decorator';
import { WalletType } from './wallet-type.enum';

@Controller('wallet')
export class WalletController {
  constructor(
    @InjectKnex() private readonly db: Knex,
  ) {}

  @OnTelegramCommand('wallet', 'Check balance')
  async wallet(context: any) {
    const { update } = context;
    const { message } = update;
    
    const wallet = await this.db('wallet')
      .where({
        userId: context.state.userId,
        type: WalletType.Default,
      })
      .first();
    const balance = wallet?.balance || 0;
    context.telegram.sendMessage(
      message.chat.id,
      `Your balance: ${balance} coins`,
      {
        reply_to_message_id: message.message_id,
      },
    );
  }
}
