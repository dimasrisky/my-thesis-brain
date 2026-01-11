import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { DocumentRepository } from './document.repository';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { DocumentChunks } from './entities/document-chunks.entity';
import { DocumentChunksRepository } from './document_chunks.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentChunks])],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepository, DocumentChunksRepository],
  exports: [DocumentService, DocumentRepository, DocumentChunksRepository],
})
export class DocumentModule {}
