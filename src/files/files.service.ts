import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(private prismaService: PrismaService) {}

  async downloadFile(
    project_id: string,
    format: string,
    language: string,
    res: Response,
  ) {
    const validFormats = ['caption', 'voice'];
    if (!validFormats.includes(format)) {
      res.status(400).send('Invalid format specified');
      return;
    }

    const model = this.prismaService[format];
    const record = await model.findUnique({
      where: { urlId: project_id },
    });

    if (!record) {
      res.status(404).send(`no data`);
      return;
    }

    const filePath = record[language];
    if (!filePath) {
      res.status(404).send(`Language property '${language}' not found`);
      return;
    }
    const fileName = `${project_id}-${format}-${language}.srt`;

    if (!fs.existsSync(filePath)) {
      res.status(404).send('File not found');
      return;
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('File download error:', err);
        res.status(500).send('Error downloading the file');
      }
    });
  }
}
