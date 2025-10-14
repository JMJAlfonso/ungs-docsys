export class JobApplicationApprovalRequestDto {
    jobApplicationId: number;
    usersApprovers: number[];
    approved: boolean;
    reason: string;
}