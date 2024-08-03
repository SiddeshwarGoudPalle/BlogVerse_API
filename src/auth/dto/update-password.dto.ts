import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  newPassword: string;
}
