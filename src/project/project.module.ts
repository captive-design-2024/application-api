import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProjectService } from './project.service';
import { ProjectController, ProjectController2 } from './project.controller';
import { UserModule } from '../user/user.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [UserModule, FilesModule],
  controllers: [ProjectController, ProjectController2],
  providers: [PrismaService, ProjectService],
})
export class ProjectModule {}
