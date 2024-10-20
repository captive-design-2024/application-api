import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SigninDto } from '../user/dto/signin.dto';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      'http://localhost:3000/auth/google',
    );
  }

  async login(dto: SigninDto) {
    const user = await this.validateUser(dto);
    const accessToken = await this.createToken(user);

    return accessToken;
  }

  async validateUser(dto: SigninDto): Promise<User> {
    const user = await this.userService.findByLoginId(dto.user_id);
    if (!user) {
      throw new NotFoundException('존재하지 않는 ID 입니다');
    }

    const isPasswordMatch = await bcrypt.compare(
      dto.user_password,
      user.password,
    );
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

  //google api
  private oauth2Client;

  generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
    });
  }

  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
  }

  getClient() {
    return this.oauth2Client;
  }

  async getToken(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.setCredentials(tokens);
    return tokens;
  }
}
