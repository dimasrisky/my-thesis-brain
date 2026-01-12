import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: 'Prompt berisi pertanyaan',
    required: true,
    example: 'Apa kelemahan waterfall?',
  })
  @IsNotEmpty()
  @IsString()
  question: string;
}
