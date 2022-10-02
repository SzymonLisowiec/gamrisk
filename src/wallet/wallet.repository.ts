import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { WalletTransactionLocation } from './wallet-transaction-location.enum';
import { WalletType } from './wallet-type.enum';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletRepository {
  public constructor(
    @InjectKnex() private readonly db: Knex,
  ) {}
  
  public async findOneByUserId(
    userId: string,
    type: WalletType,
    createIfNotExist: boolean,
    trx?: any,
  ): Promise<Wallet | null> {
    const query = this.db('wallet')
      .where({
        userId,
        type,
      })
      .first();
    if (trx) {
      query
        .transacting(trx)
        .forUpdate();
    }
    const props = await query;
    if (!props && createIfNotExist) {
      await this.create(userId, type, trx);
      return await this.findOneByUserId(userId, type, false, trx);
    }
    return props ? new Wallet(props) : null;
  }
  
  private async create(
    userId: string,
    type: WalletType,
    trx?: any,
  ): Promise<void> {
    const props = {
      userId,
      type,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const query = this.db('wallet')
      .insert(props);
    if (trx) {
      query.transacting(trx);
    }
    await query;
  }
  
  public async save(
    wallet: Wallet,
    trx?: any,
  ) {
    const snapshot = wallet.snapshot();
    const query = this.db('wallet')
      .where({
        userId: snapshot.userId,
        type: snapshot.type,
      })
      .update({
        balance: snapshot.balance,
        updatedAt: new Date,
      });
    if (trx) {
      query.transacting(trx);
    }
    await query;
  }
  
  public async saveTransaction(
    userId: string,
    type: WalletType,
    value: number,
    balance: number,
    location: WalletTransactionLocation,
    meta?: Record<string, string | number>,
    trx?: any,
  ) {
    const query = this.db('wallet_transaction')
      .insert({
        userId,
        walletType: type,
        value,
        balance, // this.db('wallet').select('balance').where({ userId, type: WalletType.Default }),
        location,
        meta: meta && JSON.stringify(meta) || null,
      });
    if (trx) {
      query.transacting(trx);
    }
    const [ transactionId ] = await query;
    return transactionId;
  }
}
