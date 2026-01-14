import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // @CreateSwaggerExample(
  //   CreateUserDto,
  //   ResponseUserDto,
  //   false,
  //   'Membuat Satu User',
  // )
  // async create(
  //   @Body() createDto: CreateUserDto,
  //   @Request() req: ExpressRequest,
  // ): Promise<BaseSuccessResponse<ResponseUserDto>> {
  //   const result = await this.userService.create(createDto, req.user);

  //   return {
  //     data: plainToInstance(ResponseUserDto, result, {
  //       excludeExtraneousValues: true,
  //     }),
  //   };
  // }

  // @Get()
  // @ListSwaggerExample(ResponseUserDto, 'Mengambil Banyak Data User')
  // async findAndCount(
  //   @Query() queryParameterDto: FilteringUserDto,
  // ): Promise<BaseSuccessResponse<ResponseUserDto>> {
  //   const { page = 1, limit = 10, isPaginate = true } = queryParameterDto;
  //   const [result, total] =
  //     await this.userService.findAndCount(queryParameterDto);

  //   return {
  //     data: plainToInstance(ResponseUserDto, result, {
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
  // @DetailSwaggerExample(ResponseUserDto, 'Mengambil Data User dengan ID')
  // async findOne(
  //   @Param() pathParamater: PathParameterDto,
  // ): Promise<BaseSuccessResponse<ResponseUserDto>> {
  //   const result = await this.userService.findOneByIdOrFail(pathParamater.id);

  //   return {
  //     data: plainToInstance(ResponseUserDto, result, {
  //       excludeExtraneousValues: true,
  //     }),
  //   };
  // }

  // @Patch(':id')
  // @DetailSwaggerExample(ResponseUserDto, 'Mengupdate Data User By Id')
  // async update(
  //   @Param() pathParamater: PathParameterDto,
  //   @Body() update: UpdateUserDto,
  //   @Request() req: ExpressRequest,
  // ): Promise<BaseSuccessResponse<ResponseUserDto>> {
  //   const result = await this.userService.update(
  //     pathParamater.id,
  //     update,
  //     req.user,
  //   );

  //   return {
  //     data: plainToInstance(ResponseUserDto, result, {
  //       excludeExtraneousValues: true,
  //     }),
  //   };
  // }

  // @Delete(':id')
  // @HttpCode(204)
  // @DeleteSwaggerExample('Menghapus Data User dengan Id')
  // async remove(
  //   @Param() pathParamater: PathParameterDto,
  //   @Request() req: ExpressRequest,
  // ): Promise<void> {
  //   await this.userService.softRemove(pathParamater.id, req.user);
  // }
}
