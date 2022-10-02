import {PaginationParams} from './pagination.dto';
import {IsOptional, IsString} from 'class-validator';

export class DevicesPaginationParams extends PaginationParams {
  @IsString({
    message: 'Device type must be a string',
  })
  @IsOptional()
  deviceType: string;
}
