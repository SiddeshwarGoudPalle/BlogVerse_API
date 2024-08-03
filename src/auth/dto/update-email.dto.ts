import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  newEmail: string;
}
