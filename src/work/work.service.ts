import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { insertPathDto, ContentFormat, ContentLanguage } from './dto/work.dto';
import axios from 'axios';
import { response } from "express";

@Injectable()
export class WorkService {
  constructor(private prismaService: PrismaService) {}

  async generateSubtitle(project_id: string): Promise<string> {
    const workerURL = 'http://host.docker.internal:4000/generate-subtitle';

    const record = await this.prismaService.project.findUnique({
      where: { id: project_id },
    });

    if (!record) {
      throw new NotFoundException(`Project with ID ${project_id} not found.`);
    }

    try {
      const response = await axios.post(
        workerURL,
        { url: record.link },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const insertDto: insertPathDto = {
        content_projectID: project_id,
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

  async generateDubbing(id: string, path: string, language: ContentLanguage) {
    const workerURL = 'http://localhost:4000/generate-dubbing';
    try {
      const response = await axios.post(
        workerURL,
        { srtFilePath: path }
        );

      // Define the data object with the correct properties
      const voiceData: any = {
        urlId: id,
      };

      // Conditionally add either myVoice or en based on the language
      if (language === 'en' && response.data) {
        voiceData.en = response.data;
      } else if (language === 'kr' && response.data) {
        voiceData.myVoice = response.data;
      }

      // Check if the entry with urlId already exists
      const existingVoice = await this.prismaService.voice.findUnique({
        where: { urlId: id }
      });

      if (existingVoice) {
        // If exists, update the entry
        await this.prismaService.voice.update({
          where: { urlId: id },
          data: voiceData
        });
      } else {
        // If not, create a new entry
        await this.prismaService.voice.create({
          data: voiceData
        });
      }

    } catch (error) {
      throw new Error (error.message)
    }
  }
}
