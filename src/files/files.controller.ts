import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { DownloadFileDto } from './dto/files.dtos';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('download')
  downloadFile(@Body() downloadFileDto: DownloadFileDto, @Res() res: Response) {
    const { content_projectID, content_format, content_language } =
      downloadFileDto;

    this.filesService.downloadFile(
      content_projectID,
      content_format,
      content_language,
      res,
    );
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
