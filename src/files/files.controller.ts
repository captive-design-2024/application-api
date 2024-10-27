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

    this.filesService.downloadSrtFile(
      content_projectID,
      content_format,
      content_language,
      res,
    );
  }

  @Post('downloadWAV')
  downloadWAVFile(@Body() dto: DownloadFileDto, @Res() res: Response) {
    const { content_projectID, content_format, content_language } = dto;

    this.filesService.downloadWavFile(
      content_projectID,
      content_format,
      content_language,
      res,
    );
  }

  @Post('update')
  updateFile(@Body('id') id: string, @Body('content') content: string) {
    return this.filesService.updateFile(id, content);
  }

  @Post('readSRT')
  readSRT(@Body() dto: ReadSRTFileDto) {
    const { content_projectID, content_language } = dto;
    return this.filesService.readSRT(content_projectID, content_language);
  }

  @Post('readSRTpath')
  readSRTpah(@Body() dto: ReadSRTFileDto) {
    const { content_projectID, content_language } = dto;
    return this.filesService.readSRTpath(content_projectID, content_language);
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
