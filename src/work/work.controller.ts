import { Controller, Req, UseGuards } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { WorkService } from './work.service';
import { genDubDto, genModelDto, genSubDto } from './dto/work.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

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
    const { content_projectID } = dto;
    await this.workService.generateDubbing(content_projectID);
  }

  @Post('llm-check')
  async check(@Body('content') content: string) {
    return await this.workService.llm_check(content);
  }

  @Post('llm-recommend')
  async recommend(
    @Body('content') content: string,
    @Body('language') language: string,
  ) {
    return await this.workService.llm_recommend(content, language);
  }

  @Post('llm-translate')
  async translate(
    @Body('content') content: string,
    @Body('language') language: string,
  ) {
    return await this.workService.llm_translate(content, language);
  }

  @Post('mp3')
  async getMP3(@Body('id') id: string, @Body('language') language: string) {
    return await this.workService.getMP3(id, language);
  }

  @Post('generate-ljs')
  @UseGuards(JwtAuthGuard)
  async generateModel(@Body() dto: genModelDto, @Req() req) {
    const { modelname, modelurl } = dto;
    return await this.workService.generateljs(modelname, modelurl, req.user.id);
  }

  @Post('test')
  @UseGuards(JwtAuthGuard)
  async test(@Body() dto: genModelDto, @Req() req) {
    const { modelname, modelurl } = dto;
    return await this.workService.test(modelname, modelurl, req.user.id);
  }
}
