import {ApiProperty} from "@nestjs/swagger";

export class AccessTokenResponsePayload {
  @ApiProperty({
    name: "accessToken",
    description: "The newly generated access token",
    type: String,
    title: "Access token"
  })
  accessToken: string;

  @ApiProperty({
    name: "refreshToken",
    description: "The newly generated refresh token",
    type: String,
    title: "Refresh token"
  })
  refreshToken: string;
}
