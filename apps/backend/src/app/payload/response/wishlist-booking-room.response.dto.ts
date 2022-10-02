import {ApiProperty} from "@nestjs/swagger";

export class WishlistBookingRoomResponseDTO {
  @ApiProperty({
    name: "id",
    description: "ID of the booking room request"

  })
  id: string;
  stt: number;
  roomId: string;
  roomName: string;
  slot: number;
}
