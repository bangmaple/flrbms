import {KeycloakSigninSuccessResponse} from "./keycloak-signin-success.response.dto";
import {KeycloakSigninFailureResponse} from "./keycloak-signin-failure.response.dto";

export type KeycloakSigninResponse = KeycloakSigninSuccessResponse | KeycloakSigninFailureResponse;
