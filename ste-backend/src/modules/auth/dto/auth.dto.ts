import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class LoginDto {
  @ApiProperty({
    description: 'The user email',
    required: true,
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The user password',
    required: true,
  })
  @IsString()
  password: string;
}
