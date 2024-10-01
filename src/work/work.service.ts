import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../prisma.service';
import {
  genSubDto,
  insertPathDto,
  ContentFormat,
  ContentLanguage,
} from './dto/work.dto';

@Injectable()
export class WorkService {
  constructor(
    private readonly httpService: HttpService,
    private prismaService: PrismaService,
  ) {}

  async generateSubtitle(dto: genSubDto): Promise<string> {
    const workerURL = 'http://worker:4000/generate-subtitle';

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          workerURL,
          { url: dto.video_url },
          { headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const insertDto: insertPathDto = {
        content_projectID: dto.content_projectID,
        content_format: ContentFormat.caption,
        content_language: ContentLanguage.kr,
        content_path: response.data,
      };

      await this.insertPath(insertDto);

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Failed to generateSubtitle: ${errorMessage}`);
    }
  }

  async insertPath(dto: insertPathDto) {
    const {
      content_projectID,
      content_format,
      content_language,
      content_path,
    } = dto;

    let model;
    const data: { [key: string]: string } = {};

    switch (content_format) {
      case ContentFormat.caption:
        model = this.prismaService.caption;
        data[content_language] = content_path;
        break;

      case ContentFormat.voice:
        model = this.prismaService.voice;
        data[content_language] = content_path;
        break;

      default:
        throw new Error(`Unsupported format: ${content_format}`);
    }

    try {
      const record = await model.upsert({
        where: { urlId: content_projectID },
        update: data,
        create: {
          urlId: content_projectID,
          ...data,
        },
      });

      return record;
    } catch (error) {
      throw new Error(`insertPath error: ${error.message}`);
    }
  }
}
