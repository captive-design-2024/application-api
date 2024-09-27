import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  @Get('test')
  downloadFile(@Res() res: Response) {
    const filePath = '/usr/src/app/srt/test.srt'; // 절대 경로로 파일 설정
    res.download(filePath, 'test.srt', (err) => {
      if (err) {
        console.error('File download error:', err);
        res.status(500).send('Error downloading the file');
      }
    });
  }
}
