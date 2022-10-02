import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, MaxLength, MIN, Min, MinLength } from "class-validator";

export class AddRoomRequest {
  @ApiProperty({
    name: "name",
    description: "Name of the room to be added",
    maxLength: 100,
    minLength: 1,
    type: String,
    example: "LB01"
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsString()
  name?: string;

  @ApiProperty({
    name: "description",
    description: "Description of the room to be added",
    maxLength: 500,
    minLength: 0,
    type: String,
    example: "New library room"
  })
  @MaxLength(500)
  @IsString()
  description?: string;

  @ApiProperty({
    name: "isDisabled",
    description: "Is the room should be disabled",
    type: Boolean,
    example: true
  })
  @IsBoolean()
  isDisabled?: boolean;

  @ApiProperty({
    name: "type",
    description: "Library room type",
    type: String,
    example: "Library Room"
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  type?: string;
}
