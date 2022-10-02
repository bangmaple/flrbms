import {Module} from "@nestjs/common";
import {CloudinaryService} from "../../services";

@Module({
  exports: [CloudinaryService],
  providers: [CloudinaryService]
})
export class CloudinaryModule {
}
