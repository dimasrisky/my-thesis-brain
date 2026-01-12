import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseLoginDto {
  @Expose()
  @ApiProperty({ description: 'token', example: '' })
  token: string;
}
