import {IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength,} from 'class-validator';
import {Transform, TransformFnParams} from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";


export class AccountUpdateProfilePayload {
  @Transform(({value}: TransformFnParams) => value?.trim())
  @IsNotEmpty({
    message: 'Full name can not be empty',
  })
  @MinLength(0)
  @MaxLength(55)
  @IsString()
  @ApiProperty({
    name: 'fullname',
    description: 'Fullname of the account',
    required: true,
    type: String,
    title: 'Fullnamer',
    example: 'Nguyễn Văn A',
    minLength: 1,
    maxLength: 256,
  })
  fullname: string;

  @Transform(({value}: TransformFnParams) => value?.trim())
  @IsNotEmpty({
    message: 'Email can not be empty',
  })
  @ApiProperty({
    name: 'email',
    description: 'Email to be added',
    required: true,
    type: String,
    title: 'Email',
    example: 'abc@fpt.edu.vn',
    minLength: 1,
    maxLength: 256,
  })
  @IsEmail()
  email: string;

  @Transform(({value}: TransformFnParams) => value?.trim())
  @Matches(/[0-9]/, {
    message: 'Phone number must be numbers'
  })
  @MinLength(10)
  @MaxLength(11)
  @IsNotEmpty({
    message: 'Phone can not be empty',
  })
  @ApiProperty({
    name: 'phone',
    description: 'Phone number to be added',
    required: true,
    type: Number,
    title: 'Phone Number',
    example: '0123456789',
    minLength: 1,
    maxLength: 256,
  })
  phone: string;

  @Transform(({value}: TransformFnParams) => value?.trim())
  @IsOptional()
  @ApiProperty({
    name: 'description',
    description: 'Description to be added',
    maxLength: 500,
    minLength: 0,
    type: String,
    example: 'New entity',
  })
  description?: string;

}
