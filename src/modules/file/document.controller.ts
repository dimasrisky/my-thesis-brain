import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateSwaggerExample } from 'src/common/swagger/swagger-example.response';
import { ResponseDocumentDto } from './dto/response-document.dto';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import type { Request as ExpressRequest } from 'express';

@Controller('documents')
@ApiTags('Document')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = path.join(
            process.cwd(),
            'src',
            'modules',
            'file',
            'uploads',
          );
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @CreateSwaggerExample(
    CreateDocumentDto,
    ResponseDocumentDto,
    false,
    'Upload File PDF',
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: ExpressRequest,
  ): Promise<boolean> {
    const result = await this.documentService.uploadFile(file, req.user!);

    return result;
  }

  // @Get()
  // @ListSwaggerExample(ResponseDocumentDto, 'Mengambil Banyak Data File')
  // async findAndCount(
  //   @Query() queryParameterDto: FilteringDocumentDto,
  // ): Promise<BaseSuccessResponse<ResponseDocumentDto>> {
  //   const { page = 1, limit = 10, isPaginate = true } = queryParameterDto;
  //   const [result, total] =
  //     await this.documentService.findAndCount(queryParameterDto);

  //   return {
  //     data: plainToInstance(ResponseDocumentDto, result, {
  //       excludeExtraneousValues: true,
  //     }),
  //     meta: {
  //       page: isPaginate ? page : 1,
  //       totalPage: isPaginate ? Math.ceil(total / limit) : 1,
  //       totalData: total,
  //     },
  //   };
  // }

  // @Get(':id')
  // @DetailSwaggerExample(ResponseDocumentDto, 'Mengambil Data File dengan ID')
  // async findOne(
  //   @Param() pathParamater: PathParameterDto,
  // ): Promise<BaseSuccessResponse<ResponseDocumentDto>> {
  //   const result = await this.documentService.findOneByIdOrFail(
  //     pathParamater.id,
  //   );

  //   return {
  //     data: plainToInstance(ResponseDocumentDto, result, {
  //       excludeExtraneousValues: true,
  //     }),
  //   };
  // }

  // @Patch(':id')
  // @DetailSwaggerExample(ResponseDocumentDto, 'Mengupdate Data File By Id')
  // async update(
  //   @Param() pathParamater: PathParameterDto,
  //   @Body() update: UpdateDocumentDto,
  //   @Request() req: ExpressRequest,
  // ): Promise<BaseSuccessResponse<ResponseDocumentDto>> {
  //   const result = await this.documentService.update(
  //     pathParamater.id,
  //     update,
  //     req.user,
  //   );

  //   return {
  //     data: plainToInstance(ResponseDocumentDto, result, {
  //       excludeExtraneousValues: true,
  //     }),
  //   };
  // }

  // @Delete(':id')
  // @HttpCode(204)
  // @DeleteSwaggerExample('Menghapus Data File dengan Id')
  // async remove(
  //   @Param() pathParamater: PathParameterDto,
  //   @Request() req: ExpressRequest,
  // ): Promise<void> {
  //   await this.documentService.softRemove(pathParamater.id, req.user);
  // }
}
