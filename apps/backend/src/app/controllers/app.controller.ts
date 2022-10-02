import {Controller, Get, HttpStatus, UseInterceptors} from "@nestjs/common";
import {AppService} from "../services";
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {PathLoggerInterceptor} from "../interceptors";

@Controller()
@ApiTags("Application")
@UseInterceptors(new PathLoggerInterceptor(AppController.name))
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @Get()
  @ApiCreatedResponse({
    description: 'Test if Web API is working correctly',
    status: HttpStatus.OK,
  })
  getData() {
    return this.appService.getData();
  }
}
