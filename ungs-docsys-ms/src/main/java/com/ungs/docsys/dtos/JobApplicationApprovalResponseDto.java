package com.ungs.docsys.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobApplicationApprovalResponseDto {
    private Long id;
    private JobApplicationResponseDto jobApplication;    
    private Boolean approved;
    private String reason;
    private AppUserResponseDto appUser;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
