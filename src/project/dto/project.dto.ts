import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_title: string;
}
