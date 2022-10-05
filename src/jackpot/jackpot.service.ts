import { Injectable } from '@nestjs/common';
import { WalletTransactionLocation } from 'src/wallet/wallet-transaction-location.enum';
import { WalletType } from 'src/wallet/wallet-type.enum';
import { WalletService } from 'src/wallet/wallet.service';
import { RoundNotFoundException } from './exception/round-not-found.exception';
import { RoundRepository } from './round.repository';

@Injectable()
export class JackpotService {
  constructor(
    private readonly walletService: WalletService,
    private readonly roundReposiotory: RoundRepository,
  ) {}

  async join(
    userId: string,
    value: number,
  ) {
    const currentRound = await this.roundReposiotory.findCurrentRound();
    if (!currentRound) {
      throw new RoundNotFoundException();
    }
    await this.walletService.subtract(userId, WalletType.Default, value, WalletTransactionLocation.Jackpot);
    currentRound.addEntry(userId, value);
    await this.roundReposiotory.save(currentRound);
  }
}
