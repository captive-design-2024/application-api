import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { WorkService } from './work.service';
import { genSubDto } from './dto/work.dto';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post('generateSub')
  async generateSub(@Body() dto: genSubDto): Promise<void> {
    const { content_projectID, video_url } = dto;
    await this.workService.generateSubtitle(content_projectID, video_url);
  }
}
