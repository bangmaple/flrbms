import {ApiProperty} from "@nestjs/swagger";

export class KeycloakUserSigninRequest {
  @ApiProperty({
    description: "The username of the signin request.",
    minLength: 1,
    maxLength: 100,
    example: 'admin',
    type: String,
    name: 'username',
    nullable: false,
    required: true,
  })
  username?: string;

  @ApiProperty({
    description: "The password of the signin request.",
    minLength: 1,
    maxLength: 100,
    example: '1234',
    type: String,
    name: 'password',
    nullable: false,
    required: true,
  })
  password?: string;
}
