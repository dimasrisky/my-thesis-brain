import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcryptjs';
import { ResponseRegisterDto } from './dto/response-register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}
  async register(createDto: CreateUserDto): Promise<ResponseRegisterDto> {
    try {
      const _createUser = this.userRepository.create({
        email: createDto.email,
        password: bcrypt.hashSync(createDto.password),
      });
      await this.userRepository.save(_createUser);
      return { message: 'User berhasil terdaftar' };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
