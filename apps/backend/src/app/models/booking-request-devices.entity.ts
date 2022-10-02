import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity("booking_request_devices")
export class BookingRequestDevices {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    comment: "ID of the Booking Request Devices"
  })
  id?: string;

  @Column({
    name: "booking_request_id",
    type: "uuid",
  })
  bookingRequestId?: string;

  @Column({
    name: "device_id",
    type: "uuid",
  })
  deviceId?: string;

  @Column({
    name: "device_quantity",
  })
  deviceQuantity?: number;
}
