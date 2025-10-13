import {
  IsString,
  MaxLength,
  IsDateString,
  IsOptional,
  IsBoolean,
  Validate
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExperienceDateRangeValidator } from '../validators/experience-date-range.validator';
import { ApiProperty } from '@nestjs/swagger';
export class ExperienceRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Job title must not exceed 150 characters' })
  jobTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Company name must not exceed 150 characters' })
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Description must not exceed 5000 characters' })
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO 8601 date string' })
  startDate?: string;
  
  @ApiProperty({ example: '2022-01-01', required: false})
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO 8601 date string' })
  endDate?: string;

  @Validate(ExperienceDateRangeValidator)
  dateValidation: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isCurrentJob must be a boolean value' })
  isCurrentJob?: boolean;
}