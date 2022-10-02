import {Module} from "@nestjs/common";
import {HealthCheckController} from "../../controllers";

@Module({
  imports: [
  ],
  controllers: [
    HealthCheckController
  ],
  providers: [],
  exports: []
})
export class HealthCheckModule {
}
