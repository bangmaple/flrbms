import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity("booking_request")
export class BookingRequest {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
    comment: "ID of the Booking Request"
  })
  id?: string;

  @Column({
    name: "room_id",
    nullable: false,
  })
  roomId?: string;

  @Column({
    name: "requested_by",
    type: "uuid",
  })
  requestedBy?: string;

  @Column({
    name: "requested_at",
    nullable: false,
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP"
  })
  requestedAt?: Date;

  @Column({
    name: "status",
    nullable: false
  })
  status?: string;

  @Column({
    name: "booking_reason_id",
    nullable: false
  })
  bookingReasonId?: string;

  @Column({
    name: "cancelled_by",
    type: "uuid",
  })
  cancelledBy?: string;

  @Column({
    name: "cancelled_at",
    nullable: false,
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP"
  })
  cancelledAt?: Date;

  @Column({
    name: "updated_by",
    type: "uuid",
  })
  updatedBy?: string;

  @Column({
    name: "updated_at",
    nullable: false,
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP"
  })
  updatedAt?: Date;

  @Column({
    name: "accepted_by",
    type: "uuid",
  })
  acceptedBy?: string;

  @Column({
    name: "accepted_at",
    nullable: false,
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP"
  })
  acceptedAt?: Date;

  @Column({
    name: "checkin_time",
    nullable: false,
  })
  checkinTime?: string;

  @Column({
    name: "checkout_time",
    nullable: false,
  })
  checkoutTime?: string;

  @Column({
    name: "checkin_date",
    nullable: false,
  })
  checkinDate?: string;

  // @Column({
  //   name: "checkout_date",
  //   nullable: false,
  //   type: "timestamptz"
  // })
  // checkoutDate?: Date;

  @Column({
    name: "checkedin_at",
    nullable: false,
    type: "timestamptz"
  })
  checkedinAt?: Date;

  @Column({
    name: "checkedout_at",
    nullable: false,
    type: "timestamptz"
  })
  checkedoutAt?: Date;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 500,
  })
  description?: string;

  @Column({
    name: 'cancel_reason',
    type: 'varchar',
    length: 100,
  })
  cancelReason?: string;

  @Column({
    name: 'signature_checkin',
    type: 'varchar',
    length: 256,
  })
  signatureCheckin?: string;

  @Column({
    name: 'signature_checkout',
    type: 'varchar',
    length: 256,
  })
  signatureCheckout?: string;

  @Column({
    name: 'booked_for',
    type: 'uuid',
  })
  bookedFor?: string;

}
