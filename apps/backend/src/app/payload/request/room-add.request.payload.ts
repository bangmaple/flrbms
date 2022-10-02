import {IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength,} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {number} from 'joi';

export class RoomAddRequestPayload {

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
  name?: string;


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


  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    name: 'isDisabled',
    description: 'Should be disabled',
    type: Boolean,
    example: true,
  })
  isDisabled?: boolean;


  @ApiProperty({
    name: 'type',
    description: 'Type to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: 'New entity',
  })
  @IsNotEmpty({
    message: 'Type can not be empty',
  })
  type?: string;

  @ApiProperty({
    name: 'capacity',
    description: 'Capacity to be added',
    maxLength: 500,
    minLength: 0,
    type: number,
    example: 'New entity',
  })
  @IsNotEmpty({
    message: 'Capacity can not be empty',
  })
  capacity?: number;

}
