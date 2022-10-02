import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('booking_request_hist')
export class BookingRequestHist {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'ID of the Booking Request Hist',
  })
  id?: string;

  @Column({
    name: 'booking_request_id',
    type: 'uuid',
  })
  bookingRequestId?: string;

  @Column({
    name: 'room_id',
    nullable: false,
  })
  roomId?: string;

  @Column({
    name: 'requested_by',
    type: 'uuid',
  })
  requestedBy?: string;

  @Column({
    name: 'requested_at',
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  requestedAt?: Date;

  @Column({
    name: 'status',
    nullable: false,
  })
  status?: string;

  @Column({
    name: 'checkin_at',
    nullable: false,
    type: 'timestamptz',
  })
  checkedInAt?: Date;

  @Column({
    name: 'checkout_at',
    nullable: false,
    type: 'timestamptz',
  })
  checkedOutAt?: Date;

  @Column({
    name: 'updated_at',
    nullable: false,
    type: 'timestamptz',
  })
  updatedAt?: Date;

  @Column({
    name: 'updated_by',
    type: 'uuid',
  })
  updatedBy?: string;

  @Column({
    name: 'booking_reason_id',
    type: 'uuid',
  })
  bookingReasonId?: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 500,
  })
  description?: string;

  @Column({
    name: 'cancelled_at',
    nullable: false,
    type: 'timestamptz',
  })
  cancelledAt?: Date;

  @Column({
    name: 'cancelled_by',
    type: 'uuid',
  })
  cancelledBy?: string;

  @Column({
    name: 'checkin_slot',
    type: 'uuid',
  })
  checkinSlot?: string;
  @Column({
    name: 'checkout_slot',
    type: 'uuid',
  })
  checkoutSlot?: string;

  @Column({
    name: "checkin_date",
    nullable: false,
  })
  checkinDate?: string;

  @Column({
    name: 'accepted_at',
    nullable: false,
    type: 'timestamptz',
  })
  acceptedAt?: Date;

  @Column({
    name: 'accepted_by',
    type: 'uuid',
  })
  acceptedBy?: string;

}
