import { RequirementRequestDto } from "./requirement-request.dto";

export class JobApplicationRequestDto {
    title: string;
    description: string;
    jobApplicationPeriodId: number;
    minApprovers: number;
    reason: string;
    yearPeriod: number;
    jobProfileLevelId: number;
    jobApplicationStatusId?: number;
    requirements?: RequirementRequestDto[];
}