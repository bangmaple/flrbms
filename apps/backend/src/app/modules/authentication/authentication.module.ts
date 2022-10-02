import {forwardRef, Module} from "@nestjs/common";
import {AuthenticationService} from "../../services";
import {AccountsModule} from "../accounts";
import {KeycloakModule} from "./keycloak.module";
import {AuthenticationController} from "../../controllers";

@Module({
  imports: [
    AccountsModule,
   KeycloakModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService]
})
export class AuthenticationModule {

}
