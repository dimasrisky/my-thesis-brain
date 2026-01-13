import {
  Body,
  Controller,
  Header,
  MessageEvent,
  Post,
  Query,
  Request,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { CreateSwaggerExample } from 'src/common/swagger/swagger-example.response';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { ResponseChatDto } from './dto/response-chat.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request as ExpressRequest } from 'express';
import { Observable } from 'rxjs';

@Controller('chat')
@ApiTags('Chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Sse('stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  @Header('X-Accel-Buffering', 'no')
  generateStreamAnswer(
    @Query() createDto: CreateChatDto,
    @Request() req: ExpressRequest,
  ): Observable<MessageEvent> {
    return this.chatService.generateStreamAnswer(createDto, req.user!);
  }

  @Post()
  @CreateSwaggerExample(
    CreateChatDto,
    ResponseChatDto,
    false,
    'Start Conversation',
  )
  async create(
    @Body() createDto: CreateChatDto,
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<ResponseChatDto>> {
    const result = await this.chatService.generateAnswer(createDto, req.user!);

    return {
      data: plainToInstance(ResponseChatDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
