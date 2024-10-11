import { Injectable } from '@nestjs/common';
const fs = require('fs');
const {google} = require('googleapis');
import { AuthService } from "../auth/auth.service";

@Injectable()
export class YoutubeService {
  private youtube;

  constructor(private readonly authService: AuthService) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: this.authService.getClient(),
    });
  }

  async insertCaption( videoId: string, language: string, captionFilePath: string ) {
    const response = await this.youtube.captions.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          videoId: videoId,
          language: language,
          name: 'Korean Caption',
        }
      },
      media: {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(captionFilePath),
      }
    });

    return response.data;
  }
}