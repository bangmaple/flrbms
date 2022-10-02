import {Repository} from 'typeorm';
import {CustomRepository} from '../decorators/typeorm-ex.decorator';
import {RoleHist} from '../models/role-hist.entity';
import {Roles} from '../models/role.entity';

@CustomRepository(RoleHist)
export class RoleHistRepository extends Repository<RoleHist> {
  async createNew(payload: Roles): Promise<RoleHist> {
    const roleId = payload.id;
    delete payload.id
    return this.save({
      roleId: roleId,
      ...payload,
    });
  }

  async deleteAllHist(id: string) {
    return await this.createQueryBuilder('role_hist')
      .delete()
      .where('role_hist.role_id = :id', {id: id})
      .useTransaction(true)
      .execute();
  }
}
