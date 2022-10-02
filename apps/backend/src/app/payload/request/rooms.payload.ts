import {PaginationPayload} from './pagination.payload';
import {IsNotEmpty, IsNumber, IsString, Max, Min} from 'class-validator';
import {validationConfig} from '../../pipes/validation/global.validator';
import {ApiProperty} from '@nestjs/swagger';

export class RoomsRequestPayload implements PaginationPayload<string> {
  @ApiProperty({
    name: 'search',
    description: 'Text string to search for',
    type: String,
    example: '',
    minLength: 0,
    maxLength: 250,
  })
  @IsString({
    message: 'Search property must be a string',
  })
  search: string;

  @ApiProperty({
    name: 'page',
    description: 'Page number to filter out items',
    type: Number,
    example: 1,
    minimum: 1,
    maximum: 9999,
  })
  @IsNotEmpty({
    message: 'Page property must not be empty',
  })
  @IsNumber(validationConfig.number)
  @Max(2147483647, {
    message: 'Page number is invalid',
  })
  @Min(1, {
    message: 'Page number must be positive integer',
  })
  page: number;

  @ApiProperty({
    name: 'size',
    description: 'Number of items to be filtered out',
    type: Number,
    example: 1,
    minimum: 1,
    maximum: 9999,
  })
  @IsNotEmpty({
    message: 'Size must not be empty',
  })
  @Max(2147483647, {
    message: 'Size number is invalid',
  })
  @Min(1, {
    message: 'Size number must be positive integer',
  })
  @IsNumber(validationConfig.number)
  limit: number;

  @ApiProperty({
    name: "sort",
    description: "Sort direction",
    type: "ASC",
    example: "DESC"
  })
  sort: object;
}
