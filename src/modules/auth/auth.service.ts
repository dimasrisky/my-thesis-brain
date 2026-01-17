import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { NotFoundException } from 'src/common/bases/exceptions/templates/not-found.exception';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

  async me(user: IJwtPayload): Promise<ResponseUserDto> {
    const userPayload = await this.userRepository.findOne({
      where: {
        id: user.userId,
      },
    });

    if (!userPayload)
      throw new NotFoundException('user tidak ditemukan', 'user');

    return userPayload;
  }

  async login(loginDto: LoginDto): Promise<ResponseLoginDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = bcrypt.compareSync(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_REFRESH_TOKEN'),
    });
    return { accessToken: token, refreshToken };
  }
}
