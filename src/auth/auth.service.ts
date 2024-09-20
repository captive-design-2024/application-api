import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SigninDto } from '../user/dto';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: SigninDto) {
    const user = await this.validateUser(dto);
    const accessToken = await this.createToken(user);

    return accessToken;
  }

  async validateUser(dto: SigninDto): Promise<User> {
    const user = await this.userService.findByLoginId(dto.login_id);
    if (!user) {
      throw new NotFoundException('존재하지 않는 ID 입니다');
    }

    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('비밀번호가 맞지 않습니다');
    }

    return user;
  }

  async createToken(user: User): Promise<string> {
    const payload = {
      id: user.login_id,
      name: user.user_name,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }
}
