import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseDocumentDto {
  @ApiProperty({ description: 'ID File', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'createdAt File' })
  @Expose()
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: '', example: null })
  filename: string;

  @Expose()
  @ApiProperty({ description: '', example: null })
  uploadDate: Date;
}
