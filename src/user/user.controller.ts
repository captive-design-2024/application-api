import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ModifyDto } from './dto/modify.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.userService.signup(signupDto);
  }

  @Get('value')
  @UseGuards(JwtAuthGuard)
  async sendNameAndEmail(@Req() req) {
    const findUser = await this.userService.findByLoginId(req.user.id);
    return [
      {
        name: findUser.user_name,
        id: findUser.login_id,
        password: findUser.password,
        email: findUser.email,
        phone: findUser.phone_number,
      },
    ];
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(@Req() req, @Body() modifyDto: ModifyDto) {
    await this.userService.updateUser(req.user.id, modifyDto);
  }
}
