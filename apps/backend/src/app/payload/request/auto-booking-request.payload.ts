import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested
} from "class-validator";
import {Type} from "class-transformer";

class AutoRoomBookingDevice {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

class AutoRoomBookingRequest {

  @IsNotEmpty()
  @IsDateString()
  date: string;

  timeStart: string;
  timeEnd: string;

  @ValidateNested({each: true})
  @Type(() => AutoRoomBookingDevice)
  devices: AutoRoomBookingDevice[];

  @IsNotEmpty()
  @IsPositive()
  capacity: number;
}

class AutoRoomBookingRequestPayload {

  @IsString()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @IsUUID()
  bookingReasonId: string;

  @IsArray()
  @ValidateNested({each: true})
  @ArrayMinSize(1)
  @Type(() => AutoRoomBookingRequest)
  bookingRequests: AutoRoomBookingRequest[];
}

class AutoRoomBookingResponsePayload {
  id: string;
  capacity: number;
  roomName: string;
  roomType: string;
  bookingReason: string;
  description: string;
  date: string;
  checkinAt: string;
  checkoutAt: string;
}

export {AutoRoomBookingRequestPayload, AutoRoomBookingRequest, AutoRoomBookingDevice, AutoRoomBookingResponsePayload};
