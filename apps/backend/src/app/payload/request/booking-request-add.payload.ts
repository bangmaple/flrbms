import {IsArray, IsNotEmpty, IsOptional, IsString, MaxLength,} from 'class-validator';
import {Transform, TransformFnParams} from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class BookingRequestAddRequestPayload {
  @Transform(({value}: TransformFnParams) => value?.trim())
  @MaxLength(100)
  @ApiProperty({
    name: 'roomId',
    description: 'Room ID to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: 'New entity',
  })
  @IsNotEmpty({
    message: 'Room can not be empty',
  })
  @IsString()
  roomId: string;

  @IsNotEmpty({
    message: 'Day checkin can not be empty',
  })
  @IsString()
  @ApiProperty({
    name: 'checkinDate',
    description: 'CheckinDate to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: 'New entity',
  })
  checkinDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'checkoutDate',
    description: 'CheckoutDate to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: 'New entity',
  })
  checkoutDate?: string;

  @IsNotEmpty({
    message: 'Slot check in can not be empty',
  })
  @IsString()
  @ApiProperty({
    name: 'checkinTime',
    description: 'checkinTime to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
  })
  checkinTime?: string;

  @IsNotEmpty({
    message: 'Slot check out can not be empty',
  })
  @IsString()
  @ApiProperty({
    name: 'checkoutTime',
    description: 'checkoutTime to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
  })
  checkoutTime?: string;

  @MaxLength(500)
  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'description',
    description: 'Descriptionn to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: 'New entity',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'bookedFor',
    description: 'Booked For',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: 'New entity',
  })
  bookedFor?: string;

  @Transform(({value}: TransformFnParams) => value?.trim())
  @IsNotEmpty({
    message: 'Reason type can not be empty',
  })
  @IsString()
  @ApiProperty({
    name: 'bookingReasonId',
    description: 'Booking reason ID',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: 'New entity',
  })
  bookingReasonId: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    name: 'listDevice',
    description: 'List of devices',
    maxLength: 500,
    minLength: 0,
    type: [],
    example: (
      [{
        "label": "Key",
        "quantity": 1,
        "value": "c82bb923-b5e4-4d16-99da-505171015964"
      },
        {
          "label": "Key",
          "quantity": 1,
          "value": "c82bb923-b5e4-4d16-99da-505171015964"
        }
      ])
  })
  listDevice: [];
}
