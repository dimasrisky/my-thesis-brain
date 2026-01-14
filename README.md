<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# My Thesis Brain

> **Asisten Riset Pribadi** untuk mahasiswa tingkat akhir yang sedang mengerjakan skripsi

## Latar Belakang Project

**My Thesis Brain** adalah solusi Backend API yang memungkinkan setiap mahasiswa untuk memiliki "Asisten Riset Pribadi". Mahasiswa bisa meng-upload PDF mereka sendiri, lalu bertanya atau mencari topik spesifik hanya dari referensi yang mereka miliki.

### Fitur Utama

- **Multi-User Authentication** - Setiap user memiliki akun pribadi dengan data yang terisolasi
- **PDF Upload & Processing** - Upload PDF jurnal, ebook, atau paper kamu
- **Semantic Search** - Cari topik spesifik menggunakan vector embeddings (RAG)
- **AI-Powered Q&A** - Tanya jawab dengan dokumenmu menggunakan LLM
- **Streaming Response** - Real-time response generation untuk pengalaman yang lebih baik
- **Data Isolation** - Data user A tidak bocor ke user B (setiap user hanya bisa mengakses dokumen sendiri)

## Teknologi yang Digunakan

### Backend Framework
- **NestJS** - Progressive Node.js framework untuk membangun aplikasi backend yang scalable
- **TypeScript** - Type safety dan better developer experience

### Database & Vector Storage
- **PostgreSQL** dengan **pgvector** - Relational database dengan kemampuan vector similarity search
- **TypeORM** - ORM untuk TypeScript dan JavaScript

### AI & LLM
- **Ollama** - Local LLM inference engine (tidak perlu API key berbayar)
- **LangChain** - Framework untuk mengembangkan aplikasi dengan LLM
- **RAG (Retrieval Augmented Generation)** - Teknik untuk menghasilkan jawaban berdasarkan dokumen spesifik

### Authentication
- **JWT (JSON Web Token)** - Stateless authentication
- **bcrypt** - Password hashing

### API Documentation
- **Scalar** - Modern API documentation references
- **Swagger** - OpenAPI specification

## Project Structure

```
src/
├── common/              # Shared utilities, decorators, DTOs
│   ├── bases/          # Base classes for entities, services, repositories
│   ├── decorators/     # Custom decorators
│   ├── dto/            # Common DTOs (pagination, query params)
│   └── exceptions/     # Custom exception filters
├── config/             # Configuration module
├── database/           # Database configuration & migrations
├── modules/
│   ├── auth/           # Authentication module (JWT, login, register)
│   ├── user/           # User management
│   ├── file/           # Document upload & processing
│   └── chat/           # Chat & Q&A with RAG
└── main.ts             # Application entry point
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Docker** & **Docker Compose**
- **pnpm** (recommended) or npm/yarn

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd my-thesis-brain
pnpm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file sesuai konfigurasi:

```env
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=thesis_brain

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES=1d

# Ollama LLM Configuration
OLLAMA_HOST=http://localhost:11434
LLM_MODEL=llama3.1
EMBEDDING_MODEL=nomic-embed-text
```

### 3. Start Services dengan Docker

```bash
docker-compose up -d
```

Ini akan menjalankan:
- **PostgreSQL** dengan pgvector di port 5433
- **Ollama** di port 11434

### 4. Pull Ollama Models

```bash
# Pull model LLM (untuk generate jawaban)
docker exec -it <ollama-container-id> ollama pull llama3.1

# Pull embedding model (untuk vector search)
docker exec -it <ollama-container-id> ollama pull nomic-embed-text
```

### 5. Run Database Migrations

```bash
pnpm run migration:run
```

### 6. Start Development Server

```bash
pnpm run start:dev
```

API akan berjalan di `http://localhost:3000`

### 7. Access API Documentation

Buka browser dan kunjungi:

```
http://localhost:3000/api
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login dan dapatkan JWT token

### Documents
- `POST /documents` - Upload PDF (requires authentication)
  - Body: `file` (multipart/form-data)
  - Returns: Success confirmation

### Chat & Q&A
- `POST /chat` - Ask question about your documents
  - Body: `{ "query": "Apa teori tentang X?" }`
  - Returns: AI-generated answer from your documents

- `GET /chat/stream` - Streaming response (Server-Sent Events)
  - Query: `?query=Apa teori tentang X?`
  - Returns: Real-time streaming response

## Cara Kerja RAG (Retrieval Augmented Generation)

```
User Question
      ↓
[Generate Query Embedding]
      ↓
[Vector Similarity Search] → Top-k Relevant Chunks from User's Documents
      ↓
[Construct Prompt with Context]
      ↓
[LLM Generates Answer] → Final Response to User
```

1. **Query Embedding** - Pertanyaan user di-convert menjadi vector
2. **Vector Search** - Mencari chunk dokumen yang paling relevant dengan query (hanya dari dokumen user tersebut)
3. **Context Augmentation** - Chunk yang relevant ditambahkan ke prompt sebagai konteks
4. **Answer Generation** - LLM menghasilkan jawaban berdasarkan konteks yang diberikan

## Keamanan & Data Isolation

- Setiap user hanya bisa mengakses dokumen yang mereka upload sendiri
- JWT authentication untuk setiap request
- Vector search dilakukan hanya pada dokumen milik user yang sedang login
- Password di-hash menggunakan bcrypt

## Testing

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

## Production Build

```bash
pnpm run build
pnpm run start:prod
```

## Troubleshooting

### Ollama connection error
Pastikan Ollama container berjalan:
```bash
docker ps | grep ollama
```

### Database connection error
Check PostgreSQL container:
```bash
docker ps | grep pgvector
```

### Migration error
Pastikan database sudah dibuat dan migration sudah di-run:
```bash
pnpm run typeorm migration:show
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Support

For questions and support, please open an issue in the repository.

---

**Built with** NestJS | PostgreSQL | Ollama | LangChain
