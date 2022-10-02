import {Injectable} from '@nestjs/common';
import {RoleHist} from '../models/role-hist.entity';
import {Roles} from '../models/role.entity';
import {RoleHistRepository} from '../repositories/role-hist.repository';

@Injectable()
export class RoleHistService {
  constructor(private readonly repository: RoleHistRepository) {
  }

  async createNew(role: Roles): Promise<RoleHist> {
    return this.repository.createNew(role);
  }

  async deleteAllHist(id: string) {
    return this.repository.deleteAllHist(id);
  }
}
