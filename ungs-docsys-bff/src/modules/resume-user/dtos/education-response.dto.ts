import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EducationResponseDto {
  @ApiProperty({ example: 'University of Example' })
  @IsString()
  instituteName: string;

  @ApiProperty({ example: 'Bachelor' })
  @IsString()
  degreeLevel: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  degree: string;

  @ApiProperty({ example: 'Software Engineering' })
  @IsString()
  fieldOfStudy: string;
}
