import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/bases/base.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService extends BaseService<
  File,
  CreateFileDto,
  UpdateFileDto
> {
  constructor(private readonly fileRepository: FileRepository) {
    super(fileRepository);
  }
}
