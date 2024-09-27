import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { ProjectModule } from './project/project.module';
import { PrismaService } from './prisma.service';
import { FiledownloadModule } from './filedownload/filedownload.module';

@Module({
  imports: [AuthModule, UserModule, ProjectModule, FiledownloadModule],
  controllers: [AppController, AuthController, ProjectController],
  providers: [AppService, ProjectService, PrismaService],
})
export class AppModule {}
