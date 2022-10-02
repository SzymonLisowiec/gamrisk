import { Injectable } from '@nestjs/common';
import { WalletTransactionLocation } from 'src/wallet/wallet-transaction-location.enum';
import { WalletType } from 'src/wallet/wallet-type.enum';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class SpinService {
  constructor(
    private readonly walletService: WalletService,
  ) {}

  async spin(context: any) {
    const { update } = context;
    const { message } = update;
    
    await this.walletService.subtract(context.state.userId, WalletType.Default, 5, WalletTransactionLocation.Spin);
    
    const result = await context.telegram.sendDice(message.chat.id, {
      reply_to_message_id: message.message_id,
      emoji: '🎰',
    });
    
    let wonValue = 0;
    switch (result.dice.value) {
      case 1:
        // 3 x bar
        wonValue = 25;
        break;
        
      case 22:
        // 3 x grape
        wonValue = 50;
        break;
        
      case 43:
        // 3 x lemon
        wonValue = 75;
        break;
        
      case 64:
        // 3 x seven
        wonValue = 100;
        break;
        
      default:
        
    }
    
    if (!wonValue) return;
    await this.walletService.add(context.state.userId, WalletType.Default, wonValue, WalletTransactionLocation.SpinWon);
    setTimeout(() => {
      context.telegram.sendMessage(
        message.chat.id,
        `Congratulations! You won ${wonValue} coins! 🎉`,
        {
          reply_to_message_id: message.message_id,
        },
      );
    }, 2000);
  }
}
