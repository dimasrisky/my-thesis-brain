import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/bases/base.repository';
import { DataSource } from 'typeorm';
import { Document } from './entities/document.entity';
import { OllamaEmbeddings } from '@langchain/ollama';

@Injectable()
export class DocumentRepository extends BaseRepository<Document> {
  constructor(private readonly dataSource: DataSource) {
    super(Document, dataSource);
  }

  private initializeEmbeddingModel() {
    const embedding = new OllamaEmbeddings({
      model: 'nomic-embed-text',
      baseUrl: 'http://localhost:11434',
    });
    return embedding;
  }

  public async similaritySearh(question: string, userId: number) {
    try {
      const embedding = this.initializeEmbeddingModel();
      const vectorQuestion = await embedding.embedQuery(question);
      const vectorString = `[${vectorQuestion.join(',')}]`;

      const result: { page_number: number; content: string; title: string }[] =
        await this.dataSource.query(
          `
      SELECT dc.page_number, dc.content, d.filename as title
      FROM document_chunks dc
      JOIN document d ON dc."documentId" = d.id
      WHERE d."userId" = $2
      ORDER BY dc.embedding <=> $1::vector
      LIMIT 3
      `,
          [vectorString, userId],
        );
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
