import {Module} from "@nestjs/common";
import {GlobalConfigController} from "../../controllers";

@Module({
  controllers: [GlobalConfigController],
  exports: [],
  imports: [],
  providers: []
})
export class AppConfigModule {

}
