import {IsNotEmpty, IsOptional} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class MasterDataAddRequestPayload {

  @IsNotEmpty({
    message: 'Name can not be empty',
  })
  @ApiProperty({
    name: 'name',
    description: 'Name to be added',
    required: true,
    type: String,
    title: 'Name',
    example: 'ABCDabc1234',
    minLength: 1,
    maxLength: 256,
  })
  name: string;


  @ApiProperty({
    name: 'description',
    description: 'Description to be added',
    required: true,
    type: String,
    title: 'Description',
    example: 'ABCDabc1234',
    minLength: 1,
    maxLength: 256,
  })
  @IsOptional()
  description?: string;


}
