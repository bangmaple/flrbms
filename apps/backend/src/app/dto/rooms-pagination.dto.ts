import {PaginationParams} from './pagination.dto';
import {IsOptional, IsString} from 'class-validator';

export class RoomsPaginationParams extends PaginationParams {
  @IsString({
    message: 'Room type must be a string',
  })
  @IsOptional()
  roomType: string;
}
