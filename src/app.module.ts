import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
