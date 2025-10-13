import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResumeFileResponseDto {
  @ApiProperty({ example: 'base64encodedfilecontent...' })
  @IsString()
  fileBinary: string;
}
