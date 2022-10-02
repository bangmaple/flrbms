import {IsEmail, IsNotEmpty, IsOptional, IsUUID, MaxLength,} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateAccountRequestPayload {
  @MaxLength(100)
  @IsNotEmpty()
  @ApiProperty({
    name: 'username',
    description: 'Username',
    required: true,
    type: String,
    title: 'Username',
    example: '',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty({
    message: `Username can't be empty`,
  })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    name: 'email',
    description: 'Email',
    required: true,
    type: String,
    title: 'Email',
    example: 'abc@example.com',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty({
    message: `Email can't be empty`,
  })
  email: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    name: 'password',
    description: 'Password',
    required: true,
    type: String,
    title: 'Password',
    example: '',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty({
    message: `Password can't be empty`,
  })
  password: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    name: 'confirmPassword',
    description: 'Confirm password',
    required: true,
    type: String,
    title: 'Confirm password',
    example: '',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty({
    message: `Confirm password can't be empty`,
  })
  confirmPassword: string;

  @MaxLength(100)
  @IsNotEmpty()
  @ApiProperty({
    name: 'firstname',
    description: 'First name',
    required: true,
    type: String,
    title: 'First Name',
    example: '',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty({
    message: `First name can't be empty`,
  })
  firstName: string;

  @MaxLength(100)
  @IsNotEmpty()
  @ApiProperty({
    name: 'lastName',
    description: 'Last name',
    required: true,
    type: String,
    title: 'Last Name',
    example: '',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty({
    message: `Last name can't be empty`,
  })
  lastName: string;

  @IsOptional()
  @MaxLength(10)
  @ApiProperty({
    name: 'phone',
    description: 'Phone number',
    required: true,
    type: String,
    title: 'Phone Number',
    example: '',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty({
    message: `Phone can't be empty`,
  })
  phone: string;

  @IsOptional()
  @MaxLength(500)
  @ApiProperty({
    name: 'description',
    description: 'Description',
    required: true,
    type: String,
    title: 'Description',
    example: '',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty({
    message: `Description can't be empty`,
  })
  description: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    name: 'roleId',
    description: 'Role ID',
    required: true,
    type: String,
    title: 'Role ID',
    example: '',
    minLength: 1,
    maxLength: 500,
  })
  @IsNotEmpty({
    message: `Role ID can't be empty`,
  })
  roleId: string;
}
