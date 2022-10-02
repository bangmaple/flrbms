import {IsNotEmpty, MaxLength,} from 'class-validator';
import {Transform, TransformFnParams} from 'class-transformer';

export class CancelRequestPayload {
  @Transform(({value}: TransformFnParams) => value?.trim())
  @MaxLength(100)
  @IsNotEmpty({
    message: 'Reason can not be empty',
  })
  reason: string;

}
