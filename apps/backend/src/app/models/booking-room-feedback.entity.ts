import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,} from 'typeorm';

@Entity('booking_room_feedback')
export class BookingRoomFeedback {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string;

  @Column({
    name: 'feedback_msg',
    type: 'varchar',
    length: 500,
  })
  feedbackMessage?: string;

  @Column({
    name: 'feedback_type',
    type: 'uuid',
  })
  feedbackType?: string;

  @Column({
    name: 'rate_num',
    type: 'smallint',
  })
  rateNum?: number;

  @Column({
    name: 'booking_room_id',
    type: 'uuid',
  })
  bookingRoomId?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt?: Date;

  @Column({
    name: 'created_by',
    type: 'uuid',
  })
  createdBy?: string;


}
