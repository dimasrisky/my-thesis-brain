import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '', example: '' })
  @IsString()
  email: string;

  @ApiProperty({ description: '', example: '' })
  @IsString()
  password: string;
}
