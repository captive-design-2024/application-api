import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';
import axios from 'axios';

@Injectable()
export class FilesService {
  constructor(private prismaService: PrismaService) {}

  async downloadFile(
    project_id: string,
    format: string,
    language: string,
    res: Response,
  ) {
    const workerURL = 'http://host.docker.internal:4000/files/download';
    try {
      const model = this.prismaService[format];
      const record = await model.findUnique({
        where: { urlId: project_id },
      });

      if (!record) {
        throw new NotFoundException(
          `No data found for project ID: ${project_id}`,
        );
      }

      const filePath = record[language];
      if (!filePath) {
        throw new NotFoundException(
          `Language property '${language}' not found`,
        );
      }

      const response = await axios.post(
        workerURL,
        { path: filePath },
        { responseType: 'arraybuffer' },
      );

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="downloaded_file.srt"`,
      });
      res.send(response.data);
    } catch (error) {
      console.error('Error in downloadFile:', error);
      throw error;
    }
  }

  async readSRT(project_id: string, language: string): Promise<string> {
    const workerURL = 'http://localhost:4000/files/readSrt';
    try {
      const record = await this.prismaService.caption.findUnique({
        where: { urlId: project_id },
      });

      if (!record) {
        throw new NotFoundException(
          `No data found for project ID: ${project_id}`,
        );
      }

      const filepath = record[language];

      const response = await axios.post(workerURL, { path: filepath });

      return response.data;
    } catch (error) {
      console.error('Error reading SRT file:', error);
      throw new NotFoundException('Error reading SRT file');
    }
  }

  async readSRTpath(project_id: string, language: string): Promise<string> {
    try {
      const record = await this.prismaService.caption.findUnique({
        where: { urlId: project_id },
      });

      if (!record) {
        throw new NotFoundException(
          `No data found for project ID: ${project_id}`,
        );
      }

      const filepath = record[language];


      return filepath;
    } catch (error) {
      console.error('Error reading SRT file:', error);
      throw new NotFoundException('Error reading SRT file');
    }
  }
}
