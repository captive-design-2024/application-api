import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Redirect,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from './guard/jwt.guard';
import { AuthService } from './auth.service';
import { SigninDto } from '../user/dto/signin.dto';
import { GoogleToken } from '../user/dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() signinDto: SigninDto) {
    return this.authService.login(signinDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  //google api
  @Get('auth')
  @Redirect()
  getGoogleAuthUrl() {
    const url = this.authService.generateAuthUrl();
    return { url };
  }

  //redirect URI
  @Get('auth/google')
  @Redirect('http://localhost:3000/Mypage')
  async getCode(@Query('code') code: string) {
    if (code.includes('%2F')) {
      code = code.replace(/%2F/g, '/');
    }
    const tokens = await this.authService.getToken(code);
    GoogleToken.accessToken = tokens.access_token;
    GoogleToken.refreshToken = tokens.refresh_token;
    console.log(GoogleToken.accessToken);
    console.log('--------------------------------');
    console.log(GoogleToken.refreshToken);
  }

  @Get('token')
  async returnToken() {
    if (GoogleToken.accessToken == null) {
      return Error('Token not found');
    }
    return {
      access: GoogleToken.accessToken,
      refresh: GoogleToken.refreshToken,
    };
  }
}
