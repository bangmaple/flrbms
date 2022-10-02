import {createParamDecorator, ExecutionContext, UnauthorizedException} from "@nestjs/common";
import {ParseTokenPipe} from "../pipes";
import {getAccessTokenViaCookie} from "../validators/utils/access-token-extractor.util";

export const KeycloakUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const accessToken = request.headers["authorization"] ?? getAccessTokenViaCookie(request);
    if (accessToken === undefined || accessToken === null) {
      throw new UnauthorizedException("Access token is not provided");
    }
    return accessToken;
  },
);

export const User = (additionalOptions?: any) => KeycloakUser(additionalOptions, ParseTokenPipe);
