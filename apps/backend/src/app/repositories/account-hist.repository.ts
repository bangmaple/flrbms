import {QueryRunner, Repository} from 'typeorm';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {AccountHist, Accounts} from '../models';

@CustomRepository(AccountHist)
export class AccountHistRepository extends Repository<AccountHist> {
  async createNew(payload: Accounts, queryRunner: QueryRunner): Promise<AccountHist> {
    const accountId = payload.id;
    delete payload.id
    return queryRunner.manager.save(AccountHist, {
      accountId: accountId,
      ...payload,
    });
  }
}
