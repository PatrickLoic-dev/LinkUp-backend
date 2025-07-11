// user.repository.ts
import { Db, WithId, OptionalUnlessRequiredId } from 'mongodb';
import { BaseRepository } from '../../../common/base.respository';
import { Account } from 'src/interfaces/Account';
import * as bcrypt from 'bcrypt';
import { Database } from 'src/database/database';

export class AccountRepository extends BaseRepository<Account> {
  constructor(database: Database) {
    super(database);
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
    return super.getBy({ email }) as unknown as WithId<Account>;
  }
}