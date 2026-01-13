import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { DocumentRepository } from '../file/document.repository';
import { Ollama } from '@langchain/ollama';
import { ResponseChatDto } from './dto/response-chat.dto';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly configService: ConfigService,
  ) {}

  private initializeModelLLM(model: string) {
    const instance = new Ollama({
      model,
      baseUrl: this.configService.get<string>('OLLAMA_HOST'),
    });

    return instance;
  }

  async generateAnswer(
    chatDto: CreateChatDto,
    user: IJwtPayload,
  ): Promise<ResponseChatDto> {
    const llmModel = this.initializeModelLLM(
      this.configService.get<string>('LLM_MODEL')!,
    );
    const similarityDocument: {
      page_number: number;
      content: string;
      title: string;
    }[] = await this.documentRepository.similaritySearh(
      chatDto.question,
      user.userId,
    );

    const contexts = similarityDocument
      .map((doc: { content: string }) => doc.content)
      .join('\n\n');

    const preference = similarityDocument
      .map((doc) => {
        return `${doc.title}, Hal ${doc.page_number}`;
      })
      .join('\n');

    const promptTemplate = `
    Kamu adalah Asisten Riset Pribadi untuk mahasiswa tingkat akhir.\n\n

    Tugasmu adalah membantu mahasiswa memahami dan menemukan informasi dari dokumen akademik (jurnal, e-book, paper ilmiah, skripsi) yang MEREKA upload sendiri ke dalam sistem.\n\n

    ATURAN WAJIB:\n
    1. Jawaban HANYA boleh berdasarkan informasi yang ada di bagian CONTEXT.\n
    2. DILARANG menggunakan pengetahuan umum atau pengetahuan di luar CONTEXT.\n
    3. DILARANG mengarang teori, definisi, kesimpulan, atau referensi.\n
    4. Jika informasi yang ditanyakan TIDAK ditemukan atau tidak relevan sama sekali pada CONTEXT,
      jawab dengan tegas dan jujur:
      "Informasi tersebut tidak ditemukan dalam dokumen yang tersedia.". tanpa kata pembuka \n
    5. Gunakan bahasa akademik yang jelas, formal, dan mudah dipahami mahasiswa.\n
    6. Jika memungkinkan, sebutkan sumber berupa nama dokumen dan nomor halaman.\n
    7. Jangan menjawab terlalu panjang, fokus pada inti informasi.\n\n

    CONTEXT:\n
    ${contexts}

    PERTANYAAN:\n
    ${chatDto.question}

    Tampilkan Sumber yang saya sertakan ini dibagian akhir dengan format [Sumber: NamaDocument - Hal, NamaDocument - Hal] Jika pertanyaan yang diajukan relevan dengan CONTEXT
    ${preference}
    `;
    const result = await llmModel.invoke(promptTemplate);

    return { answer: result };
  }
}
