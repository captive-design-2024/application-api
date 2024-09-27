import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('test')
  downloadFile(@Res() res: Response) {
    const filePath = '/usr/src/app/srt/test.srt';
    const fileName = 'test.srt';
    this.filesService.downloadFile(filePath, fileName, res);
  }
}
