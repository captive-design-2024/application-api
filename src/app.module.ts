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
import { FilesService } from './files/files.service';
import { FilesController } from './files/files.controller';
import { FilesModule } from './files/files.module';

@Module({
  imports: [AuthModule, UserModule, ProjectModule, FilesModule],
  controllers: [
    AppController,
    AuthController,
    ProjectController,
    FilesController,
  ],
  providers: [AppService, ProjectService, PrismaService, FilesService],
})
export class AppModule {}
