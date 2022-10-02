import {PaginationParams} from "./pagination.dto";
import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";
import {BookingRoomStatus} from "../enum/booking-room-status.enum";
import {Transform, TransformFnParams} from "class-transformer";

export class BookingRoomPaginationParams extends PaginationParams {

  @Transform(({value}: TransformFnParams) => value?.trim())
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    name: 'checkInAt',
    description: 'Check in at',
    maxLength: 500,
    minLength: 0,
    type: String,
    default: '',
    example: '2022-07-31 17:08:01.974+00',
  })
  checkInAt?: string

  @Transform(({value}: TransformFnParams) => value?.trim())
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    name: 'checkOutAt',
    description: 'Check out at',
    maxLength: 500,
    minLength: 0,
    default: '',
    type: String,
    example: '2022-07-31 17:08:01.974+00',
  })
  checkOutAt?: string

  @Transform(({value}: TransformFnParams) => value?.trim())
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    name: 'checkInDate',
    description: 'Check in date',
    maxLength: 500,
    minLength: 0,
    type: String,
    default: '',
    example: '2022-08-031',
  })
  checkInDate?: string

  @Transform(({value}: TransformFnParams) => value?.trim())
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    name: 'reasonType',
    description: 'Booking reason type ID',
    maxLength: 500,
    minLength: 0,
    type: String,
    default: '',
    example: 'abcdef',
  })
  reasonType?: string

  @Transform(({value}: TransformFnParams) => value?.trim())
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    name: 'status',
    description: 'Status',
    maxLength: 500,
    minLength: 0,
    default: '',
    enum: BookingRoomStatus,
    example: 'PENDING',
  })
  status?: string

}
