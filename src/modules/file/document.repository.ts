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

  public async similaritySearh(question: string) {
    try {
      const embedding = this.initializeEmbeddingModel();
      const vectorQuestion = await embedding.embedQuery(question);
      const vectorString = `[${vectorQuestion.join(',')}]`;

      const result: { page_number: number; content: string }[] =
        await this.dataSource.query(
          `
      SELECT page_number, content
      FROM document_chunks
      ORDER BY embedding <=> $1::vector
      LIMIT 3
      `,
          [vectorString],
        );
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
