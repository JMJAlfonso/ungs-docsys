import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ContactResponseDto {
  
  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123 Main St, City, Country' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'https://linkedin.com/in/username' })
  @IsString()
  linkedin: string;
}
