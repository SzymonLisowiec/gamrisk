import { NoMoneyException } from './exception/no-money.exception';
import { WalletType } from './wallet-type.enum';

type WalletProps = {
  userId: string;
  type: WalletType;
  balance: number;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class Wallet {
  private userId: string;
  private type: WalletType;
  private balance: number;
  private isEnabled: boolean;
  private createdAt: Date;
  private updatedAt: Date;
  
  constructor(
    props: WalletProps,
  ) {
    this.userId = props.userId;
    this.type = props.type;
    this.balance = props.balance;
    this.isEnabled = props.isEnabled;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getBalance() {
    return this.balance;
  }

  add(
    value: number,
  ): void {
    this.balance += value;
  }

  subtract(
    value: number,
  ): void {
    if (this.balance < value) {
      throw new NoMoneyException();
    }
    this.balance -= value;
  }
  
  snapshot() {
    return {
      userId: this.userId,
      type: this.type,
      balance: this.balance,
      isEnabled: this.isEnabled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
