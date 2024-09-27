import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  downloadFile(filePath: string, fileName: string, res: Response) {
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
