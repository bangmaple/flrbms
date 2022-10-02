import {BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger,} from '@nestjs/common';
import {AccountsService} from './accounts.service';
import {KeycloakService} from './keycloak.service';
import {UsernamePasswordCredentials, UsernamePasswordLoginResponse,} from '@app/models';
import {OAuth2Client} from 'google-auth-library';
import Exception from '../constants/exception.constant';
import {Accounts} from '../models';
import {randomUUID} from 'crypto';
import {environment} from "../../environments/environment";

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  private readonly oAuthClientId: string;
  private readonly oAuthAudience: string[];

  constructor(
    private readonly accountService: AccountsService,
    private readonly keycloakService: KeycloakService
  ) {
    this.oAuthClientId = environment.firebase.oauth.clientId;
    this.oAuthAudience = environment.firebase.oauth.audience;
  }

  async handleGoogleSignin(
    idToken: string
  ): Promise<UsernamePasswordLoginResponse> {
    const client = new OAuth2Client(this.oAuthClientId);
    try {
      const decodedToken = await client.verifyIdToken({
        idToken: idToken,
        audience: this.oAuthAudience,
      });

      const email = decodedToken.getPayload().email;

      const account = await this.accountService.findByEmail(email);
      if (!email.endsWith('@fe.edu.vn') && !account) {
        throw new BadRequestException(
          'Only FPT Education Organization email can be used!'
        );
      }
      let newUsername;

      if (!account.keycloakId) {
        const keycloakId = randomUUID();
        newUsername = decodedToken.getPayload().email.split('@')[0];
        await this.keycloakService.createKeycloakUser({
          email: email,
          firstName: decodedToken.getPayload().family_name,
          lastName: decodedToken.getPayload().given_name,
          username: newUsername,
          password: decodedToken.getPayload().email,
          roleGroup: 'staff',
        });

        await this.accountService.createNewAccountWithoutKeycloak({
          email: email,
          fullname:
            decodedToken.getPayload().family_name +
            ' ' +
            decodedToken.getPayload().given_name,
          username: newUsername,
          password: decodedToken.getPayload().email,
          role: 'Staff',
        });
      }

      const userGoogleId = decodedToken.getUserId();

      let keycloakToken = await this.accountService.getKeycloakIdByGoogleId(
        userGoogleId
      );
      if (keycloakToken === undefined) {
        await this.accountService.updateGoogleIdByAccountEmail(
          userGoogleId,
          email
        );
        keycloakToken = await this.accountService.getKeycloakIdByGoogleId(
          userGoogleId
        );
      }
      let keycloakUser;
      let user: Accounts;

      if (keycloakToken !== undefined) {
        keycloakUser =
          await this.keycloakService.getAuthenticationTokenByMasterAccount(
            keycloakToken
          );
        user = await this.accountService.getAccountByGoogleId(userGoogleId);
        const doesUserHaveAvatar =
          await this.accountService.checkIfAccountAlreadyHasAvatarImage(
            user.id
          );
        if (!doesUserHaveAvatar) {
          await this.accountService.addGoogleAvatarURLByAccountId(
            decodedToken.getPayload().picture,
            user.id
          );
        }
      } else {
        throw new HttpException(
          'Invalid account. Please contract to administrator for more information',
          HttpStatus.UNAUTHORIZED
        );
      }

      const roleName = await this.accountService.getAccountRoleById(user.id);

      return {
        accessToken: keycloakUser.access_token,
        refreshToken: keycloakUser.refresh_token,
        id: user.id,
        keycloakId: user.keycloakId,
        username: user.username,
        email: user.email,
        phone: user.phone,
        googleId: user.googleId,
        role: roleName,
        fullname: user.fullname,
        avatar: user.avatar,
        description: user.description,
      };
    } catch (e) {
      this.logger.error(e);
      this.handleGoogleSignInException(e);
    }
  }

  handleGoogleSignInException(e) {
    if (`${e} `.includes('Token used too late')) {
      throw new HttpException(
        Exception.googleAccessTokenException.expired,
        HttpStatus.BAD_REQUEST
      );
    } else if (`${e} `.includes('Invalid token signature')) {
      throw new HttpException(
        Exception.googleAccessTokenException.invalidToken,
        HttpStatus.BAD_REQUEST
      );
    } else {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async handleUsernamePasswordLogin(
    credentials: UsernamePasswordCredentials
  ): Promise<UsernamePasswordLoginResponse> {
    const isDeleted = await this.accountService.isDeletedByUsername(
      credentials.username
    );
    if (isDeleted) {
      throw new BadRequestException(
        `Your account was be deleted.
        You can't login!`
      );
    }

    const isDisable = await this.accountService.isDisabledByUsername(
      credentials.username
    );
    if (isDisable) {
      throw new BadRequestException(
        'Your account was be disbaled, connect to library to reactive account!'
      );
    }

    const keycloakToken = await this.keycloakService.signInToKeycloak(
      credentials.username,
      credentials.password
    );

    const keycloakUser = await this.keycloakService.getUserInfo(
      keycloakToken.access_token
    );

    const user = await this.accountService.findByKeycloakId(keycloakUser.sub);
    const roleName = await this.accountService.getAccountRoleById(user.id);

    return {
      accessToken: keycloakToken.access_token,
      refreshToken: keycloakToken.refresh_token,
      id: user.id,
      keycloakId: keycloakUser.sub,
      username: user.username,
      email: user.email,
      phone: user.phone,
      googleId: user.googleId,
      role: roleName,
      fullname: user.fullname,
      avatar: user.avatar,
      description: user.description,
    };
  }
}
