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
    this.configService.get<string>('OLLAMA_HOST');
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

    if (similarityDocument.length <= 0) {
      return {
        answer: 'Informasi tidak ditemukan dalam dokumen Anda.',
      };
    }

    const contexts = similarityDocument
      .map((doc: { content: string }) => doc.content)
      .join('\n\n');

    const preference = similarityDocument
      .map((doc) => {
        return `${doc.title}, Hal ${doc.page_number}`;
      })
      .join('\n');

    const promptTemplate = `
    PERAN:
    Kamu adalah Asisten Riset Pribadi untuk mahasiswa tingkat akhir.

    TUJUAN:
    Membantu mahasiswa memahami dan menemukan informasi dari dokumen akademik
    (jurnal, e-book, paper ilmiah, skripsi) yang MEREKA upload sendiri ke dalam sistem.

    ATURAN WAJIB (HARUS DIPATUHI):
    1. Jawaban HANYA boleh berdasarkan informasi yang ada di bagian CONTEXT.
    2. DILARANG menggunakan pengetahuan umum atau pengetahuan di luar CONTEXT.
    3. DILARANG mengarang teori, definisi, kesimpulan, atau referensi apa pun.
    4. Jika informasi yang ditanyakan TIDAK ditemukan atau TIDAK relevan dengan CONTEXT,
      maka jawaban WAJIB dan HANYA berupa kalimat berikut (tanpa tambahan apa pun):
      "Informasi tersebut tidak ditemukan dalam dokumen yang tersedia."
    5. Jika menjawab, gunakan bahasa akademik yang jelas, formal, dan mudah dipahami.
    6. Jangan menjawab terlalu panjang, fokus pada inti informasi.

    FORMAT JAWABAN:
    - Jika DAN HANYA JIKA pertanyaan RELEVAN dengan CONTEXT:
      - Jawab pertanyaan.
      - Di bagian akhir, tampilkan sumber dengan format:
        [Sumber: NamaDokumen - Halaman]

    - Jika pertanyaan TIDAK RELEVAN atau TIDAK ditemukan:
      - JANGAN menampilkan sumber.
      - JANGAN menambahkan penjelasan.
      - JANGAN menambahkan kalimat pembuka atau penutup.

    CONTEXT:
    ${contexts}

    PERTANYAAN:
    ${chatDto.question}

    DAFTAR SUMBER YANG TERSEDIA (HANYA DIGUNAKAN JIKA RELEVAN):
    ${preference}
    `;
    const result = await llmModel.invoke(promptTemplate);

    return { answer: result };
  }
}
