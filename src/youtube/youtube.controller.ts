import { Body, Controller, Post } from "@nestjs/common";
import { YoutubeService } from "./youtube.service";

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post()
  async insertCaption(
    @Body('videoId') videoId: string,
    @Body('language') language: string,
    @Body('captionFilePath') captionFilePath: string,
  ){
    return this.youtubeService.insertCaption( videoId, language, captionFilePath );
  }
}
