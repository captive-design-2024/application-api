import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class YoutubeService {
  private youtube;

  constructor(private readonly authService: AuthService) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: this.authService.getClient(),
    });
  }

  async insertCaption(
    videoId: string,
    language: string,
    captionFilePath: string,
  ) {
    const response = await this.youtube.captions.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          videoId: videoId,
          language: language,
          name: language + ' Caption',
        },
      },
      media: {
        mimeType: 'text/plain',
        body: captionFilePath,
      },
    });

    return response.data;
  }

  async updateCaption(id: string, captionFilePath: string) {
    const response = await this.youtube.captions.update({
      part: 'snippet',
      requestBody: {
        id: id,
      },
      media: {
        mimeType: 'text/plain',
        body: captionFilePath,
      },
    });
    return response.data;
  }

  async listCaption(videoId: string) {
    const response = await this.youtube.captions.list({
      part: 'snippet',
      videoId: videoId,
    });
    return response.data;
  }
}
