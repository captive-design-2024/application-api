import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { JwtAuthGuard } from './auth/guard/jwt.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('Mypage')
  @UseGuards(JwtAuthGuard)
  sendNameAndEmail(@Req() req) {
    const findUser = await this.userService.findByLoginId(req.user.id);
    return [{name: findUser.user_name}, {email: findUser.email}]
  }
}
