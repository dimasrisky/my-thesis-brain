import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IDocument } from '../interfaces/document.interface';
import { DocumentChunks } from './document-chunks.entity';

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
}
