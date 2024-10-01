import { Module } from '@nestjs/common';
import { WorkService } from './work.service';
import { WorkController } from './work.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [WorkController],
  providers: [WorkService, PrismaService],
  exports: [WorkService],
})
export class WorkModule {}
