import { Controller, Req, UseGuards } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { WorkService } from './work.service';
import { genDubDto, genModelDto, genSubDto, genSrtDto } from './dto/work.dto';
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

  @Post('generateVCDubbing')
  async gnerateVCDubbing(@Body() dto: genDubDto): Promise<void> {
    const { content_projectID } = dto;
    await this.workService.generateVCDubbing(content_projectID);
  }

  @Post('llm-check')
  async check(@Body() dto: genSrtDto): Promise<void> {
    const { content_projectID, content_language, content } = dto;
    return await this.workService.llm_check(
      content_projectID,
      content_language,
      content,
    );
  }

  @Post('llm-recommend')
  async recommend(
    @Body('content') content: string,
    @Body('language') language: string,
  ) {
    return await this.workService.llm_recommend(content, language);
  }

  @Post('llm-translate')
  async translate(@Body() dto: genSrtDto): Promise<void> {
    const { content_projectID, content_language, content } = dto;
    return await this.workService.llm_translate(
      content_projectID,
      content_language,
      content,
    );
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
