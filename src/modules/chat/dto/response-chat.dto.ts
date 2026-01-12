import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseChatDto {
  @Expose()
  @ApiProperty({ description: 'Jawaban', example: null })
  answer: string;
}
