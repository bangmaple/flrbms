import {IsNotEmpty, IsOptional, IsString, MaxLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class HolidayAddRequestPayload {

  @MaxLength(100)
  @ApiProperty({
    name: 'name',
    description: 'Name to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: 'New entity',
  })
  @IsNotEmpty({
    message: 'Name can not be empty',
  })
  name: string;

  @MaxLength(500)
  @ApiProperty({
    name: 'description',
    description: 'Description to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: 'New entity',
  })
  @MaxLength(500)
  @IsOptional()
  @IsString()
  description?: string;

  @MaxLength(100)
  @ApiProperty({
    name: 'dateStart',
    description: 'Date Start to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: '2022-09-01',
  })
  @IsNotEmpty({
    message: 'Date Start can not be empty',
  })
  dateStart: string;

  @MaxLength(100)
  @ApiProperty({
    name: 'dateEnd',
    description: 'Date End to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: '2022-09-02',
  })
  @IsNotEmpty({
    message: 'Date End can not be empty',
  })
  dateEnd: string;


}
