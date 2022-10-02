import {ArgumentMetadata, Injectable, Logger, PipeTransform, UnauthorizedException} from "@nestjs/common";
import {KeycloakUserInstance} from "../dto/keycloak-user.dto";
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {environment} from "../../environments/environment";

@Injectable()
export class ParseTokenPipe implements PipeTransform {

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource
  ) {
  }

  private async getKeycloakUserInstanceByAccessToken(accessToken: string): Promise<KeycloakUserInstance> {
    if (!accessToken?.includes('Bearer')) {
      accessToken = `Bearer ${accessToken}`;
    }
    const KEYCLOAK_URL = `http://${environment.keycloak.host}:${environment.keycloak.port}/auth/realms/${environment.keycloak.client.realm}`;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fetch = require('node-fetch');
    const response = await fetch(`${KEYCLOAK_URL}/protocol/openid-connect/userinfo`, {
      method: "GET",
      headers: {
        Authorization: accessToken,
      }
    });
    const data = await response.json();

    if (response.status >= 500) {
      Logger.error(data);
      throw new UnauthorizedException('Internal Server Error. Server is not working?');
    }
    if (response.status >= 400) {
      Logger.error(data);
      throw new UnauthorizedException('Invalid user credentials');
    }
    return data as KeycloakUserInstance;
  }


  private async getAccountIdByKeycloakId(keycloakId: string): Promise<string> {
    return this.dataSource.createQueryBuilder()
      .select('a.id', 'id')
      .from('accounts', 'a')
      .where('a.keycloak_id = :keycloakId', {keycloakId: keycloakId})
      .getRawOne().then((result) => result?.id);
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<KeycloakUserInstance> {
    const keycloakUser = await this.getKeycloakUserInstanceByAccessToken(value);
    const accountId = await this.getAccountIdByKeycloakId(keycloakUser.sub);
    return {
      ...keycloakUser,
      account_id: accountId
    };
  }

}
