import { Controller } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { OnTelegramCommand } from 'src/telegram/decorators/on-telegram-command.decorator';
import { OnTelegramEvent } from 'src/telegram/decorators/on-telegram-event.decorator';
import { WalletType } from 'src/wallet/wallet-type.enum';

@Controller('ranking')
export class RankingController {
  constructor(
    @InjectKnex() private readonly db: Knex,
  ) {}

  @OnTelegramCommand('ranking', 'Check ranking')
  async daily(context: any) {
    const { update } = context;
    const { message } = update;
    const page = +message.text.split(/\s/)[1] || 1;
    await this.sendRanking(context, message.chat.id, message.from, page);
  }
  
  @OnTelegramEvent({
    method: 'on',
    args: ['callback_query#ranking_page'],
  })
  async next(context: any) {
    const { update } = context;
    const { callback_query: query } = update;
    const page = +query.data.split(':')[1] || 1;
    await this.sendRanking(context, query.message.chat.id, query.from, page);
    await context.answerCbQuery();
  }
  
  async sendRanking(
    context: any,
    chatId: string,
    from: any,
    page = 1,
  ) {
    const perPage = 10;
    const offset = (page - 1) * perPage;
    const query = this.db('wallet')
      .where({
        type: WalletType.Default,
      })
      
    const total = +(await query.clone().count())[0]?.['count(*)'];
    const maxPages = Math.ceil(total / perPage);

    const rows = await query.clone()
      .innerJoin('user', 'user.id', 'wallet.userId')
      .orderBy('balance', 'desc')
      .offset(offset)
      .limit(perPage)
      .options({
        nestTables: '->',
      });
    
    let number = offset;
    let text = `<a href="tg://user?id=${from.id}">${from.username || 'User'}</a> here is ranking:\n`;
    rows.forEach((row) => {
      number += 1;
      text += `\n${number}. ${row['user->username'] || 'Private username'} (${row['wallet->balance']} coins)`;
    });
    text += `\n\nPage ${page} / ${maxPages}`;

    const inlineKeyboard = [];
    if (page > 1) {
      inlineKeyboard.push({
        text: 'Back',
        callback_data: `ranking_page:${page - 1}`,
      });
    }
    
    if (page < maxPages) {
      inlineKeyboard.push({
        text: 'Next',
        callback_data: `ranking_page:${page + 1}`,
      });
    }
    
    context.telegram.sendMessage(
      chatId,
      text,
      {
        parse_mode: 'html',
        reply_markup: {
          inline_keyboard: [
            inlineKeyboard,
          ],
        },
      },
    );
  }
}
