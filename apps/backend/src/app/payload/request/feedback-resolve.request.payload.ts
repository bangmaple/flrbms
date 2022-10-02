import {IsNotEmpty} from 'class-validator';
import {Transform, TransformFnParams} from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class FeedbackReplyRequestPayload {
  @Transform(({value}: TransformFnParams) => value?.trim())
  @IsNotEmpty({
    message: `Reply message can't be empty`,
  })
  @ApiProperty({
    name: 'feedback_message',
    description: 'Feedback message',
    required: true,
    type: String,
    title: 'Feedback message',
    example: '',
    minLength: 1,
    maxLength: 256,
  })
  replyMessage: string;
}
