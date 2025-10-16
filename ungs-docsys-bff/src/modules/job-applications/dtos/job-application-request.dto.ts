import {
    IsNotEmpty,
    IsString,
    MaxLength,
    IsNumber,
    Min,
    Max,
    IsPositive,
    IsOptional,
    isArray,
    IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { RequirementCreateRequestDto } from '../requirements/dtos/requirement-create-request.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JobApplicationRequestDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Title is required' })
    @IsString()
    @MaxLength(150, { message: 'Title must not exceed 150 characters' })
    title: string;
  
    @ApiProperty()
    @IsNotEmpty({ message: 'Description is required' })
    @IsString()
    @MaxLength(5000, { message: 'Description must not exceed 5000 characters' })
    description: string;
  
    @ApiProperty()
    @IsNotEmpty({ message: 'Job Application Period ID is required' })
    @IsNumber()
    @IsPositive({ message: 'Job Application Period ID must be a positive number' })
    jobApplicationPeriodId: number;    

    @ApiProperty()
    @IsNotEmpty({ message: 'Minimum Approvers is required' })
    @IsNumber()
    @Min(1, { message: 'Minimum Approvers must be at least one approver' })
    @Max(5, { message: 'Minimum Approvers must not exceed 5' })
    minApprovers: number;
  
    @ApiProperty()
    @IsNotEmpty({ message: 'Reason is required' })
    @IsString()
    @MaxLength(500, { message: 'Reason must not exceed 500 characters' })
    reason: string;
  
    @ApiProperty()
    @IsNotEmpty({ message: 'Year Period is required' })
    @IsNumber()
    @Type(() => Number)
    yearPeriod: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Year Period is required' })
    @IsNumber()
    @Type(() => Number)
    jobProfileLevelId: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    jobApplicationStatusId?: number;

    @ApiPropertyOptional({
        description: 'List of requirements associated with the job application',
        type: [RequirementCreateRequestDto],
    })
    @IsOptional()
    requirements?: RequirementCreateRequestDto[];
}