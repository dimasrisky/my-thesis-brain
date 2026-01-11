import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity } from 'typeorm';
import { IFile } from '../interfaces/file.interface';

@Entity()
export class File extends BaseEntity implements IFile {
  @Column({ name: 'filename', unique: false, nullable: false })
  filename: string;

  @Column({ name: 'upload_date', unique: false, nullable: false })
  uploadDate: Date;
}
