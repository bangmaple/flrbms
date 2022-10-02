import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntity} from './base/base.entity';

@Entity('account_hist')
export class AccountHist extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string;

  @Column({
    name: 'account_id',
    type: 'uuid',
  })
  accountId?: string;

  @Column({
    name: 'keycloak_id',
    type: 'varchar',
    length: 100,
  })
  keycloakId?: string;

  @Column({
    name: 'google_id',
    type: 'varchar',
    length: 100,
  })
  googleId?: string;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 100,
  })
  username?: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
  })
  email?: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 100,
  })
  phone?: string;

  @Column({
    name: 'fullname',
    type: 'varchar',
    length: 100,
  })
  fullname?: string;

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 250,
  })
  avatar?: string;

  @Column({
    name: 'role_id',
    type: 'varchar',
    length: 100,
  })
  roleId?: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 500,
  })
  description?: string;
}
