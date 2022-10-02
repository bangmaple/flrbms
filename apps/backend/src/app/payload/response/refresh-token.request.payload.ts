import {ApiProperty} from "@nestjs/swagger";

export class RefreshTokenPayload {
  @ApiProperty({
    name: "refresh_token",
    example: "example-refresh-token",
    type: String,
    required: true,
    description: "Refresh token which is given by logging into the system",
    title: "Refresh token"
  })
  refreshToken: string;
}
