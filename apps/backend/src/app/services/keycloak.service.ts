import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {lastValueFrom, map, Observable} from 'rxjs';
import {KeycloakSigninSuccessResponse} from '../payload/response/keycloak-signin-success.response.dto';
import {REQUEST} from '@nestjs/core';
import {APPLICATION_X_WWW_FORM_URLENCODED} from '@app/constants';
import {AccessTokenResponsePayload} from '../payload/response/refresh_token.response.payload';
import {RefreshTokenPayload} from '../payload/response/refresh-token.request.payload';
import {KeycloakUserInstance} from '../dto/keycloak-user.dto';
import {environment} from "../../environments/environment";

@Injectable({
  scope: Scope.REQUEST,
})
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);

  private readonly keycloakHost: string;
  private readonly keycloakPort: number;
  private readonly keycloakRealm: string;
  private readonly grantTypePassword: string;
  private readonly clientId: string;
  private readonly masterUsername: string;
  private readonly masterPassword: string;
  private readonly grantTypeRefreshToken: string;
  private readonly grantTypeTokenExchange: string;
  private readonly clientSecret: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly httpRequest: Request
  ) {
    this.keycloakHost = environment.keycloak.host;
    this.keycloakPort = environment.keycloak.port;
    this.keycloakRealm = environment.keycloak.client.realm;
    this.grantTypePassword = environment.keycloak.grant_type.password;
    this.clientId = environment.keycloak.client.id;
    this.masterUsername = environment.keycloak.master_username;
    this.masterPassword = environment.keycloak.master_password;
    this.grantTypeRefreshToken = environment.keycloak.grant_type.refresh_token;
    this.grantTypeTokenExchange = environment.keycloak.grant_type.token_exchange;
    this.clientSecret = environment.keycloak.client.secret;
  }

  async getAuthenticationTokenByMasterAccount(
    keycloakId: string
  ): Promise<KeycloakSigninSuccessResponse> {
    const {access_token} = await this.signInToKeycloak(
      this.masterUsername,
      this.masterPassword
    );
    const url = `http://${this.keycloakHost}:${this.keycloakPort}/auth/realms/${this.keycloakRealm}/protocol/openid-connect/token`;
    const payload = new URLSearchParams({
      grant_type: this.grantTypeTokenExchange,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.clientId,
      requested_subject: keycloakId,
      subject_token: access_token,
      requested_token_type: this.grantTypeRefreshToken,
    });
    const config = {
      headers: {
        'Content-Type': APPLICATION_X_WWW_FORM_URLENCODED,
      },
    };
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, payload, config)
      );
      return response.data as KeycloakSigninSuccessResponse;
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        e.response?.data['error_description'],
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  countUsers(token: string): Observable<number> {
    const COUNT_USERS_URI =
      'http://localhost:8080/auth/admin/realms/authentication/users/count';
    try {
      return this.httpService
        .get(COUNT_USERS_URI, {
          headers: {
            Authorization: token,
          },
        })
        .pipe(map((e) => e.data));
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async getAllUsers(token: string): Promise<number> {
    const USERS_URI =
      'http://localhost:9090/auth/admin/realms/authentication/users';
    try {
      return await lastValueFrom(
        this.httpService
          .get(USERS_URI, {
            headers: {
              Authorization: token,
            },
          })
          .pipe(map((e) => e.data))
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async signInToKeycloak(
    username: string,
    password: string
  ): Promise<KeycloakSigninSuccessResponse> {
    const url = `http://${this.keycloakHost}:${this.keycloakPort}/auth/realms/${this.keycloakRealm}/protocol/openid-connect/token`;
    const signInPayload = new URLSearchParams({
      client_id: environment.keycloak.client.id,
      client_secret: environment.keycloak.client.secret,
      grant_type: environment.keycloak.grant_type.password,
      username: username,
      password: password,
    });
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, signInPayload, {
          headers: {
            'Content-Type': APPLICATION_X_WWW_FORM_URLENCODED,
          },
        })
      );
      return response.data as KeycloakSigninSuccessResponse;
    } catch (e) {
      this.logger.error(e.response.data);
      throw new HttpException(
        e.response?.data['error_description'],
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async getUserByUsername(
    username: string,
    accessToken?: string
  ): Promise<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  }> {
    const {access_token} = await this.signInToKeycloak(
      this.masterUsername,
      this.masterPassword
    );

    this.logger.error(access_token);

    const url = `http://${this.keycloakHost}:${this.keycloakPort}/auth/admin/realms/${this.keycloakRealm}/users?username=${username}`;
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
      );
      return response.data[0];
    } catch (e) {
      this.logger.error(e.message);
      throw new UnauthorizedException(
        e.message || e.data || 'Invalid credentials'
      );
    }
  }

  async getUserById(authToken: string, id: string) {
    const URL = `http://${this.keycloakHost}:${this.keycloakPort}/auth/admin/realms/${this.keycloakRealm}/users/${id}`;
    try {
      const resp = await lastValueFrom(
        this.httpService.get(URL, {
          headers: {
            Authorization: authToken,
          },
        })
      );
      return resp.data;
    } catch (e) {
      this.logger.error(e.message);
      throw new ForbiddenException(e.message);
    }
  }

  async createKeycloakUser(account: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roleGroup: string;
  }): Promise<any> {
    try {
      const {access_token} = await this.signInToKeycloak(
        this.masterUsername,
        this.masterPassword
      );

      const url = `http://${this.keycloakHost}:${this.keycloakPort}/auth/admin/realms/${this.keycloakRealm}/users`;
      const payload = {
        username: account.username,
        email: account.email,
        emailVerified: true,
        firstName: account.firstName,
        lastName: account.lastName,
        enabled: true,
        groups: [account.roleGroup],
        credentials: [
          {
            temporary: false,
            type: 'password',
            value: account.password,
          },
        ],
      };
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      };
      const response = await lastValueFrom(
        this.httpService.post(url, payload, config)
      );
      if (response.status >= 400) {
        throw new BadRequestException(
          response.data?.errorMessage || 'Error while creating account'
        );
      }
    } catch (e) {
      this.logger.error(JSON.stringify(e));
      throw new BadRequestException(e.response?.data['error_description']);
    }
  }

  resetKeycloakUserById(req, id, rawPasswword: string): Promise<void> {
    try {
      return Promise.resolve();
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  signOutKeycloakUser(header: any, id: string): Promise<void> {
    try {
      return Promise.resolve();
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async refreshAccessToken(
    payload: RefreshTokenPayload
  ): Promise<AccessTokenResponsePayload> {
    const URL = `http://${this.keycloakHost}:${this.keycloakPort}/auth/realms/${this.keycloakRealm}/protocol/openid-connect/token`;
    const refreshTokenPayload = new URLSearchParams({
      client_id: environment.keycloak.client.id,
      client_secret: environment.keycloak.client.secret,
      grant_type: environment.keycloak.grant_type.native_refresh_token,
      refresh_token: payload.refreshToken,
    });

    try {
      const response = await lastValueFrom(
        this.httpService
          .post(URL, refreshTokenPayload, {
            headers: {
              'Content-Type': APPLICATION_X_WWW_FORM_URLENCODED,
            },
          })
          .pipe(map((e) => e.data))
      );
      return {
        accessToken: response['access_token'],
        refreshToken: response['refresh_token'],
      };
    } catch (e) {
      this.logger.error(e.response.data);
      throw new BadRequestException(e.response.data);
    }
  }

  async getUserInfo(accessToken: string): Promise<KeycloakUserInstance> {
    if (!accessToken?.includes('Bearer')) {
      accessToken = `Bearer ${accessToken}`;
    }
    try {
      const URL = `http://${this.keycloakHost}:${this.keycloakPort}/auth/realms/${this.keycloakRealm}/protocol/openid-connect/userinfo`;
      const response = await lastValueFrom(
        this.httpService.get(URL, {
          headers: {
            Authorization: accessToken,
          },
        })
      );
      return response.data;
    } catch (e) {
      this.logger.error(e.response.data);
      throw new UnauthorizedException('Invalid user credentials');
    }
  }

  async changePasswordByKeycloakId(
    keycloakId: string,
    password: string
  ): Promise<void> {
    try {
      const {access_token} = await this.signInToKeycloak(
        this.masterUsername,
        this.masterPassword
      );
      const URL = `http://${this.keycloakHost}:${this.keycloakPort}/auth/admin/realms/${this.keycloakRealm}/users/${keycloakId}/reset-password`;
      return await lastValueFrom(
        this.httpService
          .put(
            URL,
            {
              value: password,
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .pipe(map((e) => e.data))
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(e.message);
    }
  }

  async removeKeycloakUserByKeycloakUsername() {
  }
}
