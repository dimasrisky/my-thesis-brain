import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import type { Request as ExpressRequest } from 'express';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { PathParameterDto } from 'src/common/dto/path-paramater.dto';
import {
  CreateSwaggerExample,
  DeleteSwaggerExample,
  DetailSwaggerExample,
  ListSwaggerExample,
} from 'src/common/swagger/swagger-example.response';
import { CreateFileDto } from './dto/create-file.dto';
import { FilteringFileDto } from './dto/filtering-file.dto';
import { ResponseFileDto } from './dto/response-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileService } from './file.service';

@Controller('file')
@ApiTags('File')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @CreateSwaggerExample(
    CreateFileDto,
    ResponseFileDto,
    false,
    'Membuat Satu File',
  )
  async create(
    @Body() createDto: CreateFileDto,
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<ResponseFileDto>> {
    const result = await this.fileService.create(createDto, req.user);

    return {
      data: plainToInstance(ResponseFileDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get()
  @ListSwaggerExample(ResponseFileDto, 'Mengambil Banyak Data File')
  async findAndCount(
    @Query() queryParameterDto: FilteringFileDto,
  ): Promise<BaseSuccessResponse<ResponseFileDto>> {
    const { page = 1, limit = 10, isPaginate = true } = queryParameterDto;
    const [result, total] =
      await this.fileService.findAndCount(queryParameterDto);

    return {
      data: plainToInstance(ResponseFileDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: {
        page: isPaginate ? page : 1,
        totalPage: isPaginate ? Math.ceil(total / limit) : 1,
        totalData: total,
      },
    };
  }

  @Get(':id')
  @DetailSwaggerExample(ResponseFileDto, 'Mengambil Data File dengan ID')
  async findOne(
    @Param() pathParamater: PathParameterDto,
  ): Promise<BaseSuccessResponse<ResponseFileDto>> {
    const result = await this.fileService.findOneByIdOrFail(pathParamater.id);

    return {
      data: plainToInstance(ResponseFileDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Patch(':id')
  @DetailSwaggerExample(ResponseFileDto, 'Mengupdate Data File By Id')
  async update(
    @Param() pathParamater: PathParameterDto,
    @Body() update: UpdateFileDto,
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<ResponseFileDto>> {
    const result = await this.fileService.update(
      pathParamater.id,
      update,
      req.user,
    );

    return {
      data: plainToInstance(ResponseFileDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Delete(':id')
  @HttpCode(204)
  @DeleteSwaggerExample('Menghapus Data File dengan Id')
  async remove(
    @Param() pathParamater: PathParameterDto,
    @Request() req: ExpressRequest,
  ): Promise<void> {
    await this.fileService.softRemove(pathParamater.id, req.user);
  }
}
