import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SignupDto } from './dto';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ModifyDto } from './dto/modify.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async findByLoginId(id: string): Promise<User | undefined> {
    return await this.prismaService.user.findUnique({
      where: { login_id: id },
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.prismaService.user.findUnique({
      where: { email: email },
    });
  }

  async findByPhoneNumber(p_number: string): Promise<User | undefined> {
    return await this.prismaService.user.findUnique({
      where: { phone_number: p_number },
    });
  }

  async signup(dto: SignupDto) {
    const findById: User = await this.findByLoginId(dto.user_id);
    const findByEmail = await this.findByEmail(dto.user_email);
    const findByPhone = await this.findByPhoneNumber(dto.user_phone);

    if (findById) {
      throw new ConflictException('이미 존재하는 ID 입니다');
    }
    if (findByEmail) {
      throw new ConflictException('이미 존재하는 이메일 입니다');
    }
    if (findByPhone) {
      throw new ConflictException('이미 존재하는 전화번호 입니다');
    }

    const encryptedPassword = await bcrypt.hash(dto.user_password, 10);
    dto.user_password = encryptedPassword;

    await this.prismaService.user.create({
      data: {
        login_id: dto.user_id,
        password: dto.user_password,
        email: dto.user_email,
        user_name: dto.user_name,
        phone_number: dto.user_phone,
      },
    });
  }

  async updateUser(id: string, dto: ModifyDto) {
    const findUser = await this.findByLoginId(id);
    const updateData: any = {};

    if (dto.user_name !== null && dto.user_name !== undefined) {
      updateData.user_name = dto.user_name;
    }
    if (dto.user_password !== null && dto.user_password !== undefined) {
      updateData.user_password = await bcrypt.hash(dto.user_password, 10);
    }
    if (dto.user_email !== null && dto.user_email !== undefined) {
      updateData.user_email = dto.user_email;
    }
    if (dto.user_phone !== null && dto.user_phone !== undefined) {
      updateData.user_phone = dto.user_phone;
    }

    if (Object.keys(updateData).length > 0) {
      try {
        const updatedUser = await this.prismaService.user.update({
          where: {
            id: findUser.id,
          },
          data: updateData,
        });
        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
    } else {
      throw new Error('No data provided for update.');
    }
  }
}
