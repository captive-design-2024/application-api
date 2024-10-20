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
import { FilesModule } from './files/files.module';
import { WorkModule } from './work/work.module';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProjectModule,
    FilesModule,
    WorkModule,
    YoutubeModule,
  ],
  controllers: [AppController, AuthController, ProjectController],
  providers: [AppService, ProjectService, PrismaService],
})
export class AppModule {}
