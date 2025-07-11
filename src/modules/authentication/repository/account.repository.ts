// user.repository.ts
import { Db, WithId, OptionalUnlessRequiredId } from 'mongodb';
import { BaseRepository } from '../../../common/base.respository';
import { Account } from 'src/interfaces/Account';
import * as bcrypt from 'bcrypt';

export class AccountRepository extends BaseRepository<Account> {
  constructor(db: Db) {
    super(db, Account);
  }

  async createAccount(account: OptionalUnlessRequiredId<Account>){
    const hashedPassword = await bcrypt.hash(account.password, 10);
    const createdAccount = await super.create({
      ...account,
      password: hashedPassword,
      createdAt: Date.now(),
    });
  }

  async findByEmail(email: string): Promise<WithId<Account> | null> {
    return this.collection.findOne({ email });
  }
}