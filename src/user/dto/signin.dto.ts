import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  login_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
