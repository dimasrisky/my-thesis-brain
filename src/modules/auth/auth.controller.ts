import { Body, Controller, Post } from '@nestjs/common';
import { CreateSwaggerExample } from 'src/common/swagger/swagger-example.response';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { BaseSuccessResponse } from 'src/common/bases/base.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @CreateSwaggerExample(CreateUserDto, ResponseUserDto, false, 'Register User')
  async register(
    @Body() createDto: CreateUserDto,
  ): Promise<BaseSuccessResponse<ResponseRegisterDto>> {
    const result = await this.authService.register(createDto);
    return {
      data: plainToInstance(ResponseRegisterDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
