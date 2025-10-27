package com.ungs.docsys.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppUserResponseDto {
    private Long id;
    private String email;
    private Boolean active;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
