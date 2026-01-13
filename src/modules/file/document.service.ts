import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/bases/base.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';
import { DocumentRepository } from './document.repository';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { CharacterTextSplitter } from '@langchain/textsplitters';
import * as fs from 'fs';
import * as path from 'path';
import { OllamaEmbeddings } from '@langchain/ollama';
import { DocumentChunksRepository } from './document_chunks.repository';
import { IMetadata } from './interfaces/metadata.interface';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentService extends BaseService<
  Document,
  CreateDocumentDto,
  UpdateDocumentDto
> {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly documentChunksRepository: DocumentChunksRepository,
    private readonly configService: ConfigService,
  ) {
    super(documentRepository);
  }

  private removeUploadedFile(filename: string): void {
    const filePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'file',
      'uploads',
      filename,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  private initializeModel() {
    const textSplitter = new CharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const embeddingModel = new OllamaEmbeddings({
      model: this.configService.get<string>('EMBEDDING_MODEL'),
      baseUrl: this.configService.get<string>('OLLAMA_HOST'),
    });

    return {
      textSplitter,
      embeddingModel,
    };
  }

  async uploadFile(
    file: Express.Multer.File,
    user: IJwtPayload,
  ): Promise<boolean> {
    const pdfLoader = new PDFLoader(
      path.join(
        process.cwd(),
        'src',
        'modules',
        'file',
        'uploads',
        file.filename,
      ),
    );
    const documents = await pdfLoader.load();

    const { textSplitter, embeddingModel } = this.initializeModel();

    const chunk_documents = await textSplitter.splitDocuments(documents);

    const _createDocument = this.documentRepository.create({
      user: {
        id: user.userId,
      },
      filename: file.originalname,
      uploadDate: new Date(),
    });
    const document = await this.documentRepository.save(_createDocument);

    const texts = chunk_documents.map((chunk) => chunk.pageContent);

    const embeddings = await embeddingModel.embedDocuments(texts);

    const _bulkCreateChunks = chunk_documents.map((chunk, index) => {
      const chunkMetadata: IMetadata = chunk.metadata as IMetadata;
      return this.documentChunksRepository.create({
        document: {
          id: document.id,
        },
        content: chunk.pageContent,
        page_number: chunkMetadata.loc.pageNumber,
        embedding: embeddings[index],
      });
    });

    await this.documentChunksRepository.save(_bulkCreateChunks);

    this.removeUploadedFile(file.filename);
    return true;
  }
}
