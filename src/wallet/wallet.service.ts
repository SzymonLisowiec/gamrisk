import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { WalletTransactionLocation } from './wallet-transaction-location.enum';
import { WalletType } from './wallet-type.enum';
import { WalletRepository } from './wallet.repository';

@Injectable()
export class WalletService {
  constructor(
    @InjectKnex() private readonly db: Knex,
    private readonly walletRepository: WalletRepository,
  ) {}

  public async subtract(
    userId: string,
    type: WalletType,
    value: number,
    location: WalletTransactionLocation,
    meta?: Record<string, string | number>,
  ): Promise<number> {
    const { transactionId } = await this.updateWalletBalance(
      'subtract',
      userId,
      type,
      value,
      location,
      meta,
    );
    return transactionId;
  }
  
  public async add(
    userId: string,
    type: WalletType,
    value: number,
    location: WalletTransactionLocation,
    meta?: Record<string, string | number>,
  ): Promise<number> {
    const { transactionId } = await this.updateWalletBalance(
      'add',
      userId,
      type,
      value,
      location,
      meta,
    );
    return transactionId;
  }
  
  private async updateWalletBalance(
    mode: 'add' | 'subtract',
    userId: string,
    type: WalletType,
    value: number,
    location: WalletTransactionLocation,
    meta?: Record<string, string | number>,
  ) {
    const trx = await this.db.transaction();
    try {
      const wallet = await this.walletRepository.findOneByUserId(userId, type, true, trx);
      wallet[mode](value);
      await this.walletRepository.save(wallet, trx);
      const transactionId = await this.walletRepository.saveTransaction(
        userId,
        type,
        mode === 'subtract' ? 0 - value : value,
        wallet.getBalance(),
        location,
        meta,
        trx,
      );
      await trx.commit();
      
      return {
        transactionId,
        wallet,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
