import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class ResponsePreferenceDto {
  @Expose()
  @ApiProperty({ description: '', example: '' })
  filename: string;

  @Expose()
  @ApiProperty({ description: '', example: '' })
  content: string;

  @Expose()
  @ApiProperty({ description: '', example: '' })
  pageNumber: number;
}

export class ResponseChatDto {
  @Expose()
  @ApiProperty({ description: 'Jawaban', example: null })
  answer: string;

  @Expose()
  @Type(() => ResponsePreferenceDto)
  @ApiProperty({
    description: 'Daftar sumber dokumen',
    type: () => ResponsePreferenceDto,
    isArray: true,
  })
  preferences: ResponsePreferenceDto[];
}
