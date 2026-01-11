import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ description: '', required: true, example: '' })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({
    description: '',
    required: true,
    example: '2026-01-11T07:25:24.647Z',
  })
  @IsNotEmpty()
  @IsDate()
  uploadDate: Date;
}
