import { AppUserExtendedResponseDto } from "../../../modules/login/app-user/dtos/app-user-extended-response.dto";
import { JobApplicationPeriodResponseDto } from "../job-application-periods/dtos/job-application-period-response.dto";
import { JobApplicationStatusResponseDto } from "../job-application-statuses/dtos/job-application-status-response.dto";
import { RequirementResponseDto } from "../requirements/dtos/requirement-response.dto";
import { JobProfileLevelResponseDto } from "../job-profile-levels/dtos/job-profile-level.dto";

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