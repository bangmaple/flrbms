import {Injectable} from '@nestjs/common';
import {QueryRunner} from 'typeorm';
import {AccountHist, Accounts} from '../models';
import {AccountHistRepository} from '../repositories/account-hist.repository';

@Injectable()
export class AccountHistService {
  constructor(private readonly repository: AccountHistRepository) {
  }

  async createNew(account: Accounts, queryRunner: QueryRunner): Promise<AccountHist> {
    return this.repository.createNew(account, queryRunner);
  }
}
