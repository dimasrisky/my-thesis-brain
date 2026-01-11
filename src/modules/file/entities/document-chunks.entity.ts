import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Document } from './document.entity';

@Entity()
export class DocumentChunks extends BaseEntity {
  @ManyToOne(() => Document, (document) => document.documentChunks, {
    onDelete: 'CASCADE',
  })
  document: Document;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'page_number', type: 'integer' })
  page_number: number;

  @Column('vector', { length: 768, nullable: true })
  embedding: number[];
}
