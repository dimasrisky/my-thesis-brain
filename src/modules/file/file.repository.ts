import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/bases/base.repository';
import { DataSource } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FileRepository extends BaseRepository<File> {
  constructor(private readonly dataSource: DataSource) {
    super(File, dataSource);
  }
}
