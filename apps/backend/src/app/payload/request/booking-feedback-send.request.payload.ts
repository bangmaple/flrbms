import {IsNotEmpty, IsNumber, IsOptional, Max, Min} from 'class-validator';
import {Transform, TransformFnParams} from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class BookingFeedbackSendRequestPayload {
  @Transform(({value}: TransformFnParams) => value?.trim())
  @IsNotEmpty({
    message: `Message can't be empty`,
  })
  @ApiProperty({
    name: 'message',
    description: 'Booking room feedback message',
    required: true,
    type: Number,
    title: 'Messagse',
    example: '',
    minLength: 1,
    maxLength: 256,
  })
  message: string;

  @Transform(({value}: TransformFnParams) => Number(value))
  @IsNotEmpty({
    message: `rate num can't be empty`,
  })
  @ApiProperty({
    name: 'rateNum',
    description: 'Rate Number',
    required: true,
    type: Number,
    title: '3',
    example: '5',
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rateNum: number;

  @IsNotEmpty({
    message: `Booking room id can't be empty`,
  })
  @ApiProperty({
    name: 'booking-room-id',
    description: 'Rate Number',
    required: true,
    type: String,
    title: '3',
    example: '',
    minLength: 1,
    maxLength: 256,
  })
  bookingRoomId: string;

  @ApiProperty({
    name: 'feedback-type',
    description: 'Feedback type ID',
    required: true,
    type: String,
    title: 'Feedback-type',
    example: '',
    minLength: 1,
    maxLength: 256,
  })
  @IsOptional()
  type: string;

}
