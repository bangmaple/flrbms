import {IsDateString, IsInt, IsOptional, IsString, Max, MaxLength, Min,} from 'class-validator';
import {Transform} from 'class-transformer';
import {ContainsMany} from '../validators/contains-many.validator';
import {ApiProperty} from "@nestjs/swagger";

export class PaginationParams {

  @IsOptional()
  @IsString({
    message: 'Search value must be a string',
  })
  @MaxLength(100, {
    message: 'Maximum length for search is 100 characters',
  })
  @ApiProperty({default: '', required: false})
  search: string;

  @Transform((val) => Number.parseInt(val.value))
  @IsInt({
    message: 'Page number must be integer',
  })
  @IsOptional()
  @Min(1, {
    message: 'Minimum value for page number is 1',
  })
  @ApiProperty({default: 1, required: true})
  page: number;

  @Transform((val) => Number.parseInt(val.value))
  @IsInt({
    message: 'Items per page must be integer',
  })
  @IsOptional()
  @Min(1, {
    message: 'Items per page must be at least 1',
  })
  @Max(50, {
    message: 'Items per page maximum value is 50',
  })
  @ApiProperty({default: 5, required: true})
  limit: number;

  @IsString({
    message: 'Dir value must be a string',
  })
  @ContainsMany(['ASC', 'DESC'], {
    message: 'Direction must be ASC or DESC',
  })
  @IsOptional()
  @ApiProperty({default: 'ASC', required: true})
  dir: string;

  @IsOptional()
  @IsString({
    message: 'Sorting field must be a string',
  })
  @ApiProperty({default: 'date_start', required: true})
  sort: string;

  @IsOptional()
  @IsDateString({}, {each: true})
  fromDate: string;

  @IsOptional()
  @IsDateString({}, {each: true})
  toDate: string;
}
