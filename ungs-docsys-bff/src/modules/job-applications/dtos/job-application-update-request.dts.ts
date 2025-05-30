import {
  IsOptional,
  MaxLength,
  Min,
  Max,
  IsNumber,
  IsString,
} from 'class-validator';

export class JobApplicationUpdateRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  jobApplicationPeriodId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minApprovers?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @IsOptional()
  @IsNumber()
  yearPeriod?: number;
}
