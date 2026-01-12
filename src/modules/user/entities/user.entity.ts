import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { Document } from 'src/modules/file/entities/document.entity';

@Entity()
export class User extends BaseEntity implements IUser {
  @Column({ name: 'email', unique: true, nullable: false })
  email: string;

  @Column({ name: 'password', unique: false, nullable: false })
  password: string;

  @OneToMany(
    () => Document,
    document => document.user
  )
  documents: Document[]
}
