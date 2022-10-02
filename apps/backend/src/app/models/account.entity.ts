import {Column, Entity, Generated, PrimaryColumn} from 'typeorm';
import {BaseEntityWithDisabled} from './base/base.entity';

@Entity('accounts')
export class Accounts extends BaseEntityWithDisabled {
  @PrimaryColumn('uuid', {
    name: 'id',
    comment: 'ID for Room',
  })
  @Generated('uuid')
  id?: string;

  @Column({
    name: 'keycloak_id',
    nullable: false,
    unique: true,
    length: 36,
    type: 'varchar',
    comment: 'The keycloak account id that associated with this user.',
  })
  keycloakId?: string;

  @Column({
    type: 'varchar',
    name: 'google_id',
  })
  googleId?: string;

  @Column({
    name: 'username',
    nullable: false,
    unique: true,
    length: 100,
    type: 'varchar',
  })
  username?: string;

  @Column({
    name: 'fullname',
    nullable: false,
    unique: true,
    length: 200,
    type: 'varchar',
  })
  fullname?: string;

  @Column({
    name: 'email',
    nullable: false,
    unique: true,
    length: 100,
    type: 'varchar',
    comment: 'The email of the user',
  })
  email?: string;

  @Column({
    name: 'phone',
    nullable: false,
    unique: true,
    length: 10,
    type: 'varchar',
    comment: 'The phone number of the user',
  })
  phone?: string;

  @Column({
    name: 'description',
    nullable: false,
    unique: false,
    length: 500,
    type: 'varchar',
    comment: 'Describe the user.',
  })
  description?: string;

  @Column({
    name: 'role_id',
    type: 'varchar',
    length: '36',
    nullable: false,
    comment: 'Role of the associated user.',
  })
  roleId?: string;

  @Column({
    name: 'avatar',
    nullable: false,
    unique: true,
    length: 256,
    type: 'varchar',
  })
  avatar?: string;

  @Column({
    name: 'fcm_token',
    nullable: false,
    unique: true,
    length: 500,
    type: 'varchar',
  })
  fcmToken?: string;
}
