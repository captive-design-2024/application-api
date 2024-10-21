import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { WorkService } from './work.service';
import { genDubDto, genSubDto } from "./dto/work.dto";

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post('generateSub')
  async generateSub(@Body() dto: genSubDto): Promise<void> {
    const { content_projectID } = dto;
    await this.workService.generateSubtitle(content_projectID);
  }

  @Post('generateDubbing')
  async gnerateDubbing(@Body() dto: genDubDto): Promise<void> {
    const { content_projectID, filePath ,content_language } = dto;
    await this.workService.generateDubbing( content_projectID, filePath, content_language );
  }
}
