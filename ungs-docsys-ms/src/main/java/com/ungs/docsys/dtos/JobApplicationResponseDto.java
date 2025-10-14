package com.ungs.docsys.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class JobApplicationResponseDto {
    private Long id;
    private String code;
    private String title;
    private String description;
    private JobApplicationStatusResponseDto jobApplicationStatus;
    private JobApplicationPeriodResponseDto jobApplicationPeriod;
    private double[] userApprovers;
    private Long minApprovers;
    private String reason;
    private Long yearPeriod;
    private Boolean active;
    private AppUserResponseDto appUser;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private List<RequirementResponseDto> requirements;
    private JobProfileLevelResponseDto jobProfileLevel;
}
