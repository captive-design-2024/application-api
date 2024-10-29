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
  es = 'es',
  de = 'de',
}

export class genSubDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content_projectID: string;
}

export class genDubDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content_projectID: string;
}

export class genSrtDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content_projectID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content_language: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
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

export class genModelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  modelname: string;

  @ApiProperty()
  modelurl: string[];
}
