import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IDocument } from '../interfaces/document.interface';
import { DocumentChunks } from './document-chunks.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class Document extends BaseEntity implements IDocument {
  @Column({ name: 'filename', unique: false, nullable: false })
  filename: string;

  @Column({ name: 'upload_date', unique: false, nullable: false })
  uploadDate: Date;

  @OneToMany(
    () => DocumentChunks,
    (documentChunks) => documentChunks.document,
    {
      onDelete: 'CASCADE',
    },
  )
  documentChunks: DocumentChunks[];

  @ManyToOne(() => User, (user) => user.documents, { onDelete: 'CASCADE' })
  user: User;
}
