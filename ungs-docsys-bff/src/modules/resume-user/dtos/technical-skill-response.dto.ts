import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TechnicalSkillResponseDto {
  @ApiProperty({ example: 'JavaScript' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Advanced' })
  @IsString()
  level: string;
}
