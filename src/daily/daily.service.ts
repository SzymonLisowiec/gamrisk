import { Injectable } from '@nestjs/common';
import { WalletTransactionLocation } from 'src/wallet/wallet-transaction-location.enum';
import { WalletType } from 'src/wallet/wallet-type.enum';
import { WalletService } from 'src/wallet/wallet.service';
import { DailyRepository } from './daily.repository';
import { AlreadyRedeemedException } from './exceptions/already-redeemed.exception';

@Injectable()
export class DailyService {
  constructor(
    private readonly dailyRepository: DailyRepository,
    private readonly walletService: WalletService,
  ) {}

  async redeem(
    userId: string,
  ): Promise<number> {
    const reward = await this.dailyRepository.findLastRewardForUser(userId);
    if (reward && Date.now() - reward.createdAt.getTime() <= 86400 * 1000) {
      throw new AlreadyRedeemedException();
    }
    await this.dailyRepository.saveLastRewardForUser(userId);
    const value = 100;
    await this.walletService.add(userId, WalletType.Default, value, WalletTransactionLocation.DailyReward);
    return value;
  }
}
