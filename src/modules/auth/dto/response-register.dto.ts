import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ResponseRegisterDto {
  @Expose()
  @ApiProperty({
    description: 'pesan sukses',
    example: 'User berhasil terdaftar',
  })
  @IsString()
  message: string;
}
