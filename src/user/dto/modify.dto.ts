import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ModifyDto {
  @ApiProperty()
  user_name: string;

  @ApiProperty()
  @IsString()
  user_password: string;

  @ApiProperty()
  @IsEmail()
  user_email: string;

  @ApiProperty()
  user_phone: string;
}
