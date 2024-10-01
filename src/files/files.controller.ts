import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { DownloadFileDto, ReadSRTFileDto } from './dto/files.dtos';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('downloadSRT')
  downloadFile(@Body() dto: DownloadFileDto, @Res() res: Response) {
    const { content_projectID, content_format, content_language } = dto;

    this.filesService.downloadFile(
      content_projectID,
      content_format,
      content_language,
      res,
    );
  }

  @Get('readSRT')
  readSRT(@Body() dto: ReadSRTFileDto) {
    const { content_projectID, content_language } = dto;
    return this.filesService.readSRT(content_projectID, content_language);
  }

  @Get('test')
  downloadTestFile(@Res() res: Response) {
    const filePath = '/usr/src/app/srt/test.srt';
    res.download(filePath, 'test.srt', (err) => {
      if (err) {
        console.error('File download error:', err);
        res.status(500).send('Error downloading the file');
      }
    });
  }
}
