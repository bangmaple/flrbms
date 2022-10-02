import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import {AuthenticationService, KeycloakService} from '../services';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {KEYCLOAK_PATH} from '../constants/controllers/keycloak/path.constant';
import {AUTHORIZATION_LOWERCASE} from '../constants/network/headers.constant';
import {UsernamePasswordLoginResponse} from '@app/models';
import {PathLoggerInterceptor} from '../interceptors';
import {AccessTokenResponsePayload} from '../payload/response/refresh_token.response.payload';
import {RefreshTokenPayload} from '../payload/response/refresh-token.request.payload';
import {Roles} from '../decorators';
import {Role} from '../enum';
import {FastifyReply} from 'fastify';
import {ChangeProfilePasswordRequest} from '../payload/request/change-password.request.payload';

export class AuthenticationRequest {
  @ApiProperty({
    example: 'admin',
  })
  username?: string;
  password?: string;
}

class GoogleIDTokenRequest {
  @ApiProperty({
    example: 'example-id-token-as-jwt',
    type: String,
    required: true,
    description: 'JWT ID Token given by Google Authentication Provider',
    name: 'token',
    title: 'Google ID Token',
  })
  token: string;
}

@ApiBearerAuth()
@Controller(KEYCLOAK_PATH.requestPath)
@ApiTags('Authentication')
@UseInterceptors(new PathLoggerInterceptor(AuthenticationController.name))
export class AuthenticationController {
  constructor(
    private readonly service: KeycloakService,
    private readonly authenticationService: AuthenticationService
  ) {
  }

  @Post('info')
  @ApiOperation({
    summary: 'Get information of keycloak account',
    description: "Get information of keycloak account'",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Successfully got information from Keycloak account to current DB',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while getting information from Keycloak account ',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @HttpCode(HttpStatus.OK)
  async validateTokenAndGetUserInfo(@Body() payload: { token: string }) {
    if (Object.keys(payload).length < 1) {
      throw new BadRequestException('Must provide access token');
    }
    return this.service.getUserInfo(payload.token);
  }

  @Post(KEYCLOAK_PATH.signIn)
  @ApiOperation({
    summary: 'Sign in by keycloak id',
    description: 'Sign into the system using provided username and password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully signed in by keycloak id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while signing in by keycloak id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiBody({
    required: true,
    description: 'Contains the username and password value.',
    type: AuthenticationRequest,
  })
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Res({passthrough: true}) httpResponse: FastifyReply,
    @Body() account: { username: string; password: string }
  ): Promise<Partial<UsernamePasswordLoginResponse>> {
    const resp = await this.authenticationService.handleUsernamePasswordLogin(
      account
    );
    httpResponse.header('Authorization', resp.accessToken);
    httpResponse.header('AuthorizationRefreshToken', resp.refreshToken);
    httpResponse.header('Set-Cookie', [
      `accessToken=${resp.accessToken}; Max-Age=999999; HttpOnly; path=/`,
      `refreshToken=${resp.accessToken}; Max-Age=999999; HttpOnly; path=/`,
    ]);

    return {
      email: resp.email,
      id: resp.id,
      googleId: resp.googleId,
      phone: resp.phone,
      username: resp.username,
      keycloakId: resp.keycloakId,
      role: resp.role,
      fullname: resp.fullname,
      avatar: resp.avatar,
      description: resp.description,
    };
  }

  @Post('signin/google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login into system using Google ID Token',
    description:
      'Use Google ID Token to login into the system then return the user instance with access token and refresh token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully logged into the system',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid Google ID Token credentials',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while signing with Google ID Token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @HttpCode(HttpStatus.OK)
  async signInWithGoogle(
    @Res({passthrough: true}) httpResponse: FastifyReply,
    @Body() request: GoogleIDTokenRequest
  ) {
    const resp = await this.authenticationService.handleGoogleSignin(
      request.token
    );

    httpResponse.header('Authorization', resp.accessToken);
    httpResponse.header('AuthorizationRefreshToken', resp.refreshToken);
    httpResponse.header('Set-Cookie', [
      `accessToken=${resp.accessToken}; Max-Age=999999; HttpOnly; path=/`,
      `refreshToken=${resp.accessToken}; Max-Age=999999; HttpOnly; path=/`,
    ]);
    return {
      email: resp.email,
      id: resp.id,
      googleId: resp.googleId,
      phone: resp.phone,
      username: resp.username,
      keycloakId: resp.keycloakId,
      role: resp.role,
      fullname: resp.fullname,
      description: resp.description,
    };
  }

  @Post(KEYCLOAK_PATH.refreshAccessToken)
  @ApiOperation({
    summary: 'Refresh access token using provided refresh token',
    description:
      'Provide new access token and new refresh token by using provided refresh token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully refreshed access token',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Failed to validate provided refresh token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while refresh accessing token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @HttpCode(HttpStatus.OK)
  async refreshAccessToken(
    @Res({passthrough: true}) httpResponse: FastifyReply,
    @Body() payload: RefreshTokenPayload
  ): Promise<AccessTokenResponsePayload> {
    const resp = await this.service.refreshAccessToken(payload);
    httpResponse.header('Authorization', resp.accessToken);
    httpResponse.header('AuthorizationRefreshToken', resp.refreshToken);
    httpResponse.header('Set-Cookie', [
      `accessToken=${resp.accessToken}; Max-Age=999999; HttpOnly; path=/`,
      `refreshToken=${resp.accessToken}; Max-Age=999999; HttpOnly; path=/`,
    ]);
    return resp;
  }

  @Post(KEYCLOAK_PATH.signOut)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign out ',
    description: 'Sign out by keycloak ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully signed out the system',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Failed to validate provided refresh token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while signing out the system',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  signOut(@Request() req: Request, @Param('id') id: string) {
    return this.service.signOutKeycloakUser(
      req.headers[AUTHORIZATION_LOWERCASE],
      id
    );
  }

  @ApiOperation({
    summary: 'Count the number of users authenticated in this system ',
    description: 'Count how many users are authenticated in this system',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully signed out the system',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while signing out the system',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @Get(KEYCLOAK_PATH.countUsers)
  countUsers(@Request() request: Request) {
    return this.service.countUsers(request.headers[AUTHORIZATION_LOWERCASE]);
  }

  @ApiOperation({
    summary: 'Get all users by keycloak ',
    description: 'Get the list of users from keycloak',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got the users from keycloak',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while getting all users',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @Get(KEYCLOAK_PATH.getUsers)
  getAllKeycloakUsers(@Request() req: Request) {
    return this.service.getAllUsers(req.headers[AUTHORIZATION_LOWERCASE]);
  }

  @Get(KEYCLOAK_PATH.getUserById)
  @ApiOperation({
    summary: 'Get user by keycloak ID',
    description: 'Use keycloak ID to get the information of a user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully got the users from keycloak',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while retrieving a user',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the existed keycloak user',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  getKeycloakUserById(@Request() req: Request, @Param('id') id: string) {
    return this.service.getUserById(req.headers[AUTHORIZATION_LOWERCASE], id);
  }

  @Put(KEYCLOAK_PATH.refreshUserPasswordById)
  @ApiOperation({
    summary: 'Refresh user password by ID',
    description: 'Use ID to refresh user password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully refreshed user password',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error while refreshing user password',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient privileges',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the existed keycloak user',
    type: String,
    required: true,
    example: 'ABCD1234',
  })
  @ApiBody({
    schema: {
      type: 'string',
      items: {
        type: 'string',
        items: {
          type: 'number',
        },
      },
    },
  })
  @Roles(Role.APP_STAFF)
  resetKeycloakUserPassword(
    @Request() req: Request,
    @Param('id') id,
    @Body() password: ChangeProfilePasswordRequest
  ) {
    return this.service.resetKeycloakUserById(req, id, password.newPassword);
  }
}
