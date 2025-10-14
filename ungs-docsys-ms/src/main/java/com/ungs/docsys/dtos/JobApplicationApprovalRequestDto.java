package com.ungs.docsys.dtos;

import lombok.Data;

@Data
public class JobApplicationApprovalRequestDto {
    private Long jobApplicationId;
    private Double[] usersApprovers;
    private Boolean approved;
    private String reason;
}
