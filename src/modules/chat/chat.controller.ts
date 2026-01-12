import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { CreateSwaggerExample } from 'src/common/swagger/swagger-example.response';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { ResponseChatDto } from './dto/response-chat.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('chat')
@ApiTags('Chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @CreateSwaggerExample(
    CreateChatDto,
    ResponseChatDto,
    false,
    'Start Conversation',
  )
  async create(
    @Body() createDto: CreateChatDto,
  ): Promise<BaseSuccessResponse<ResponseChatDto>> {
    const result = await this.chatService.generateAnswer(createDto);

    return {
      data: plainToInstance(ResponseChatDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
