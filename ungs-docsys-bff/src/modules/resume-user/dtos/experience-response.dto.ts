import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ExperienceResponseDto {
  @ApiProperty({ example: 'Software Developer' })
  @IsString()
  jobTitle: string;

  @ApiProperty({ example: 'Example Corp' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: 'Developed web applications.' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2020-01-01' })
  @IsString()
  startDate: string;

  @ApiProperty({ example: '2022-01-01', required: false })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCurrentJob: boolean;
}
