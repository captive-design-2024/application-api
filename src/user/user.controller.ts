import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.userService.signup(signupDto);
  }
}
