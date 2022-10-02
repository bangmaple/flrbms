import {PaginationPayload} from "./pagination.payload";
import {IsNotEmpty, IsNumber, IsString, Max, Min} from 'class-validator';
import {validationConfig} from "../../pipes/validation/global.validator";

export class DevicesRequestPayload implements PaginationPayload<string> {
  @IsString({
    message: 'Search property must be a string'
  })
  search: string;

  @IsNotEmpty({
    message: 'Page property must not be empty'
  })
  @IsNumber(validationConfig.number)
  @Max(2147483647, {
    message: 'Page number is invalid'
  })
  @Min(1, {
    message: 'Page number must be positive integer'
  })
  page: number;

  @IsNotEmpty({
    message: 'Size must not be empty'
  })
  @Max(2147483647, {
    message: 'Size number is invalid'
  })
  @Min(1, {
    message: 'Size number must be positive integer'
  })
  @IsNumber(validationConfig.number)
  limit: number;

  sort: object;
};
