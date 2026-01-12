import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity } from 'typeorm';
import { IUser } from '../interfaces/user.interface';

@Entity()
export class User extends BaseEntity implements IUser {
  @Column({ name: 'email', unique: true, nullable: false })
  email: string;

  @Column({ name: 'password', unique: false, nullable: false })
  password: string;
}
