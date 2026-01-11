import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/bases/base.repository';
import { DataSource } from 'typeorm';
import { DocumentChunks } from './entities/document-chunks.entity';

@Injectable()
export class DocumentChunksRepository extends BaseRepository<DocumentChunks> {
  constructor(private readonly dataSource: DataSource) {
    super(DocumentChunks, dataSource);
  }
}
