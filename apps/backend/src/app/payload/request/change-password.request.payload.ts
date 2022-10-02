import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class ChangeProfilePasswordRequest {
  @ApiProperty({
    name: "username",
    required: true,
    type: String,
    example: "example-account",
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  username: string;

  @ApiProperty({
    name: "password",
    required: true,
    type: String,
    example: "my-password",
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  password: string;

  @ApiProperty({
    name: "newPassword",
    required: true,
    type: String,
    example: "my-password",
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  newPassword: string;
}
