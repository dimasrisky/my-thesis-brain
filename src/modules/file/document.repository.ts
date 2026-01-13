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
          SELECT
            dc.page_number,
            dc.content,
            d.filename AS title,
            dc.embedding <=> $1::vector AS distance
          FROM document_chunks dc
          JOIN document d ON dc."documentId" = d.id
          WHERE d."userId" = $2
            AND dc.embedding <=> $1::vector < 0.5
          ORDER BY distance
          LIMIT 3;
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
