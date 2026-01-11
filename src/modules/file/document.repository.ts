import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/bases/base.repository';
import { DataSource } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentRepository extends BaseRepository<Document> {
  constructor(private readonly dataSource: DataSource) {
    super(Document, dataSource);
  }
}
