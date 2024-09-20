import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_password: string;

  @ApiProperty()
  @IsNotEmpty()
  user_name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  user_email: string;

  @ApiProperty()
  @IsNotEmpty()
  user_phone: string;
}
