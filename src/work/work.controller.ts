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

  @Post('llm-check')
  async check(@Body('content') content: string) {
    return await this.workService.llm_check( content );
  }

  @Post('llm-recommend')
  async recommend(
    @Body('content') content: string,
    @Body('language') language: string,
  ) {
    return await this.workService.llm_recommend( content, language );
  }

  @Post('llm-translate')
  async translate(
    @Body('content') content: string,
    @Body('language') language: string,
  ) {
    return await this.workService.llm_translate( content, language );
  }

  @Post('mp3')
  async getMP3(@Body('id') id: string, @Body('language') language: string) {
    return await this.workService.getMP3(id, language);
  }
}
