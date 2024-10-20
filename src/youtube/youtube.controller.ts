import { Body, Controller, Post } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post()
  async insertCaption(
    @Body('videoId') videoId: string,
    @Body('language') language: string,
    @Body('captionFilePath') captionFilePath: string,
  ) {
    return this.youtubeService.insertCaption(
      videoId,
      language,
      captionFilePath,
    );
  }

  @Post('update')
  async updateCaption(
    @Body('id') id: string,
    @Body('captionFilePath') captionFilePath: string,
  ) {
    return this.youtubeService.updateCaption(id, captionFilePath);
  }

  @Post('list')
  async listCaption(@Body('videoId') videoId: string) {
    return this.youtubeService.listCaption(videoId);
  }
}
