import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UserController],
  imports: [ConfigModule],
  providers: [UserService, PrismaService],
})
export class UserModule {}
