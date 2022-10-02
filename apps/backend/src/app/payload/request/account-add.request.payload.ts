import {IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength,} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class AccountAddRequestPayload {
  @MinLength(5)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty({
    message: 'Userame can not be empty',
  })
  @ApiProperty({
    name: 'username',
    description: 'Username to be added',
    required: true,
    type: String,
    title: 'Username',
    example: 'ABCDabc1234',
  })
  username: string;

  @MinLength(5)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty({
    message: 'FullName can not be empty',
  })
  @ApiProperty({
    name: 'fullname',
    description: 'Fullname to be added',
    required: true,
    type: String,
    title: 'Fullname',
    example: 'Nguyễn Văn A',
  })
  fullname: string;

  @MinLength(10)
  @MaxLength(10)
  @IsString()
  @IsOptional()
  @Matches(/[0-9]/, {
    message: 'Phone number must be numbers',
  })
  @ApiProperty({
    name: 'phone',
    description: 'Phone number to be added',
    required: true,
    type: Number,
    title: 'Phone Number',
    example: '0123456789',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
  @ApiProperty({
    name: 'email',
    description: 'Email to be added',
    required: true,
    type: String,
    title: 'Email',
    example: 'abc@fpt.edu.vn',
  })
  email?: string;

  @MaxLength(100)
  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'Description',
    description: 'Description to be added',
    required: true,
    type: String,
    title: 'Description',
    example: '',
  })
  description?: string;

  @IsString()
  @IsNotEmpty({
    message: 'Role can not be empty',
  })
  @ApiProperty({
    name: 'roleId',
    description: 'Role ID to be added',
    required: true,
    type: String,
    title: 'Role ID',
    example: '23dc0f4f-77f8-47c8-a78f-bcad84e5edee',
  })
  roleId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'avatar',
    description: 'Avatar of the account',
    required: true,
    type: String,
    title: 'avatar',
    example: 'http://google.com/',
    minLength: 1,
    maxLength: 256,
  })
  avatar: string;

  @ApiProperty({
    name: 'isDisabled',
    description: 'Is the account should be disabled',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isDisabled?: boolean;
}
