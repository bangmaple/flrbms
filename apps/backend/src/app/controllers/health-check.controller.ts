import {Controller, Get, Req, UseInterceptors} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {PathLoggerInterceptor} from "../interceptors";
import {FastifyRequest} from "fastify";
import {Roles} from "../decorators";

@Controller("/v1/health")
@ApiTags("Health Check")
@UseInterceptors(new PathLoggerInterceptor(HealthCheckController.name))
export class HealthCheckController {


  @ApiOperation({
    description: "Health check endpoint without authentication"
  })
  @Get()
  doHealthCheck(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve("pong!");
      reject("dead");
    });
  }

  @ApiOperation({
    description: "Health check endpoint without authentication"
  })
  @Get("auth")
  @Roles()
  doHealthCheckWithAuth(@Req() request: FastifyRequest): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve("pong!");
      reject("dead");
    });
  }

}
