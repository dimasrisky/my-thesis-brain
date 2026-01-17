import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  CreateSwaggerExample,
  ListSwaggerExample,
} from 'src/common/swagger/swagger-example.response';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { ResponseLoginDto } from './dto/response-login.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import type { Request as ExpressRequest } from 'express';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @CreateSwaggerExample(
    CreateUserDto,
    ResponseRegisterDto,
    false,
    'Register User',
  )
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

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ListSwaggerExample(ResponseUserDto, 'Me')
  async me(
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<ResponseUserDto>> {
    const result = await this.authService.me(req.user!);
    return {
      data: plainToInstance(ResponseUserDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Public()
  @Post('login')
  @CreateSwaggerExample(CreateUserDto, ResponseLoginDto, false, 'Login User')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<BaseSuccessResponse<ResponseLoginDto>> {
    const result = await this.authService.login(loginDto);
    return {
      data: plainToInstance(ResponseLoginDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
