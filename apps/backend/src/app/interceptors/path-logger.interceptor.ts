import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";

@Injectable()
export class PathLoggerInterceptor implements NestInterceptor {

  private readonly logger = new Logger(this.className);

  constructor(private readonly className: string) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`API: [${request.method}] - ${request.url}`);
    return next.handle();
  }

}
