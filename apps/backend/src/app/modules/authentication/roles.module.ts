import {forwardRef, Module} from '@nestjs/common';
import {RoleService} from '../../services/role.service';
import {TypeOrmExModule} from '../global';
import {RoleController} from '../../controllers/role.controller';
import {RolesRepository} from '../../repositories/roles.repository';
import {AccountsModule} from '../accounts';
import {RoleHistRepository} from '../../repositories/role-hist.repository';
import {RoleHistService} from '../../services/role-hist.service';
import {KeycloakModule} from "./keycloak.module";

@Module({
  imports: [
    forwardRef(() => AccountsModule),
    TypeOrmExModule.forCustomRepository([RolesRepository, RoleHistRepository]),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleHistService],
  exports: [RoleService, RoleHistService],
})
export class RolesModule {
}
