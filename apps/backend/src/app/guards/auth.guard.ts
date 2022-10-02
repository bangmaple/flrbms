import {CanActivate, ExecutionContext, Inject} from "@nestjs/common";
import {KeycloakService} from "../services";
import {getAccessTokenViaCookie} from "../validators/utils/access-token-extractor.util";

class AuthGuard implements CanActivate {

  constructor(@Inject(KeycloakService) private readonly keycloakService: KeycloakService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = getAccessTokenViaCookie(request);
    const response = await this.keycloakService.getUserInfo(accessToken);
    return !!response;
  }

}
