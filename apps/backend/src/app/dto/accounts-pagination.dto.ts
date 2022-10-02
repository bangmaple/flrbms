import {PaginationParams} from './pagination.dto';
import {IsOptional, IsString} from 'class-validator';

export class AccountsPaginationParams extends PaginationParams {
  @IsString({
    message: 'Role must be a string',
  })
  @IsOptional()
  role: string;
}
