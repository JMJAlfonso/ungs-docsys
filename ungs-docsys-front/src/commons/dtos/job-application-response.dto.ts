import { AppUserExtendedResponseDto } from "./app-user-extended-response.dto";
import { JobApplicationPeriodResponseDto } from "./job-application-period-response.dto";
import { JobApplicationStatusResponseDto } from "./job-application-status-response.dto";
import { JobProfileLevelResponseDto } from "./job-profile-level-response.dto";
import { RequirementResponseDto } from "./requirement-response.dto";

export class JobApplicationResponseDto {
  id: number;
  code: string;
  title: string;
  description: string;
  jobApplicationStatus: JobApplicationStatusResponseDto;
  jobApplicationPeriod: JobApplicationPeriodResponseDto;
  minApprovers: number;
  reason: string;
  yearPeriod: number;
  active: boolean;
  appUser: AppUserExtendedResponseDto;
  createdDate: Date;
  updatedDate: Date;
  requirements: RequirementResponseDto[];
  jobProfileLevel: JobProfileLevelResponseDto;
  
}