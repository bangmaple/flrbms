import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from '../decorators';
import {Role} from '../enum';
import {AccountsService, KeycloakService} from '../services';
import {getAccessTokenViaCookie} from '../validators/utils/access-token-extractor.util';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accountsService: AccountsService,
    private readonly keycloakService: KeycloakService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const requestHeaders = request.headers;
    const accessToken = requestHeaders['authorization'] ?? getAccessTokenViaCookie(request);

    console.warn(accessToken);
    const keycloakUser = await this.keycloakService.getUserInfo(accessToken);


    if (requiredRoles && requiredRoles.length > 0) {
       const accountRole = await this.accountsService.getAccountRoleByKeycloakId(
        keycloakUser.sub
      );
      return requiredRoles.some((role) => accountRole === role);
    }

    return !!keycloakUser;
  }
}
