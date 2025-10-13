package com.ungs.docsys.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplicationUpdateRequestDto {
    @Size(max = 150, message = "Title must not exceed 150 characters")
    @Pattern(regexp = "^[^\\s].*", message = "Title must not start with whitespace")
    private String title;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    @Pattern(regexp = "^[^\\s].*", message = "Description must not start with whitespace")
    private String description;

    @Positive(message = "Job Application Period ID must be a positive number")
    private Long jobApplicationPeriodId;
    
    private Integer[] usersApproval;

    @Min(value = 1, message = "Minimum Approvers must be at least one approver")
    private Long minApprovers;

    @Size(max = 500, message = "Reason must not exceed 500 characters")
    @Pattern(regexp = "^[^\\s].*", message = "Reason must not start with whitespace")
    private String reason;

    private Long yearPeriod;
    private Long jobProfileLevelId;
}
