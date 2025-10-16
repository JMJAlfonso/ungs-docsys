package com.ungs.docsys.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import org.apache.commons.lang3.builder.EqualsExclude;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationRequestDto {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @NotNull(message = "Job Application Period ID is required")
    @Positive(message = "Job Application Period ID must be a positive number")
    private Long jobApplicationPeriodId;    

    @NotNull(message = "Minimum Approvers is required")
    @Min(value = 1, message = "Minimum Approvers must be at least one approver")
    @Max(value = 5, message = "Minimum Approvers must not exceed 5")
    private Long minApprovers;

    @NotBlank(message = "Reason is required")
    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;

    @NotNull(message = "Year Period is required")
    private Long yearPeriod;

    @NotNull(message = "Job profile leve is required")
    private Long jobProfileLevelId;

    private Long jobApplicationStatusId;

    private List<RequirementRequestDto> requirements;
}
