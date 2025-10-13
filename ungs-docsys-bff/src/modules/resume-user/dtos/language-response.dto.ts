import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LanguageResponseDto {
  @ApiProperty({ example: 'English' })
  @IsString()
  language: string;

  @ApiProperty({ example: 'Fluent' })
  @IsString()
  level: string;
}
