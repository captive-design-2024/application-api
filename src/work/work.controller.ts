import { Controller } from '@nestjs/common';
import { Post, Body, Get } from '@nestjs/common';
import { WorkService } from './work.service';
import { genSubDto } from './dto/work.dto';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post('testGenerateSub')
  testsub(@Body() dto: genSubDto) {
    const filePath = this.workService.generateSubtitle(dto);
    return filePath;
  }

  @Get('generteSub')
  generateSub(@Body() dto: genSubDto) {
    const filePath = this.workService.generateSubtitle(dto);
    return filePath;
  }
}
