import { AppUserExtendedResponseDto } from "./app-user-extended-response.dto";
import { JobApplicationResponseDto } from "./job-application-response.dto";

export class JobApplicationApprovalResponseDto {
    id: number;
    jobApplication: JobApplicationResponseDto;
    usersApprovers : number[];    
    approved: boolean;
    reason: string;
    appUser: AppUserExtendedResponseDto;
    createdDate: Date;
    updatedDate: Date;
}