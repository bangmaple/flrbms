import {Module} from '@nestjs/common';
import {KeycloakService} from '../../services';
import {HttpModule} from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [],
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule {
}
