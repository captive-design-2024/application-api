import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export enum ContentFormat {
  caption = 'caption',
  voice = 'voice',
}

export enum ContentLanguage {
  kr = 'kr',
  en = 'en',
  jp = 'jp',
}

export class genSubDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content_projectID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  video_url: string;
}

export class insertPathDto {
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content_path: string;
}