import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../prisma.service';
import { genSubDto, insertPathDto } from './dto/work.dto';

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
      return response.data;
    } catch (error) {
      // 에러 응답 데이터도 포함하여 문제 파악을 용이하게 만듦
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Failed to generate subtitle: ${errorMessage}`);
    }
  }

  async insertPath(dto: insertPathDto, path: string) {
    const project_id = dto.content_projectID;
    const format = dto.content_format;
    const language = dto.content_language;

    const validFormats = ['caption', 'voice'];
    if (!validFormats.includes(format)) {
      throw new Error('Invalid format specified');
    }

    // Use a type assertion to specify the correct model type
    const model = this.prismaService[format] as
      | Prisma.CaptionDelegate<
          Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
        >
      | Prisma.VoiceDelegate<
          Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
        >;

    // Check if a record with the given urlId already exists
    const existingRecord = await model.findUnique({
      where: { urlId: project_id },
    });

    // If it exists, update the existing record
    if (existingRecord) {
      const updatedRecord = await model.update({
        where: { urlId: project_id },
        data: {
          [language]: path, // Update the language-specific field
        },
      });
      return updatedRecord; // Return the updated record
    } else {
      // If it does not exist, create a new record
      const newRecord = await model.create({
        data: {
          urlId: project_id,
          [language]: path, // Set the language-specific field
        },
      });
      return newRecord; // Return the newly created record
    }
  }
}
