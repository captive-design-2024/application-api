import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ContentFormat {
  CAPTION = 'caption',
  VOICE = 'voice',
}

export enum ContentLanguage {
  KOREAN = 'ko',
  ENGLISH = 'en',
  JAPANESE = 'jp',
}

export class DownloadFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content_projectID: string;

  @ApiProperty({ enum: ContentFormat })
  @IsEnum(ContentFormat)
  @IsNotEmpty()
  content_format: ContentFormat;

  @ApiProperty({ enum: ContentLanguage })
  @IsEnum(ContentLanguage)
  @IsNotEmpty()
  content_language: ContentLanguage;
}

export class ReadSRTFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content_projectID: string;

  @ApiProperty({ enum: ContentLanguage })
  @IsEnum(ContentLanguage)
  @IsNotEmpty()
  content_language: ContentLanguage;
}
