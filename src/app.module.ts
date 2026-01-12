import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseValidationPipe } from './common/bases/base.validation';
import { AllExceptionFilter } from './common/bases/exceptions/base.exception';
import { typeOrmConfig } from './database/database';
import { DocumentModule } from './modules/file/document.module';
import { ChatModule } from './modules/chat/chat.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    DocumentModule,
    UserModule,
    AuthModule,
    ChatModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => await typeOrmConfig(),
      inject: [],
    }),
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_PIPE, useClass: BaseValidationPipe },
  ],
})
export class AppModule {}
