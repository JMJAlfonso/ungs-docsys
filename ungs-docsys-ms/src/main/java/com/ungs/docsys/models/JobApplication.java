package com.ungs.docsys.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "job_application", schema = "recruitment")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 36, updatable = false)
    private String code;
    @Column(nullable = false, length = 150)
    private String title;
    @Column(nullable = false, length = 5000)
    private String description;
    @ManyToOne
    @JoinColumn(name = "job_application_status_id", nullable = false)
    private JobApplicationStatus jobApplicationStatus;
    @ManyToOne
    @JoinColumn(name = "job_application_period_id", nullable = false)
    private JobApplicationPeriod jobApplicationPeriod;
    @Column(name="user_approvers", nullable = true)
    private Integer[] usersApproval;
    @Column(name="min_approvers", nullable = true)
    private Long minApprovers;
    @Column(nullable = false, length = 500)
    private String reason;
    @Column(name="year_period", nullable = false, length = 5000)
    private Long yearPeriod;
    @Column(nullable = false, length = 5000)
    private Boolean active;
    @ManyToOne
    @JoinColumn(name = "user_id_creator", nullable = false)
    private AppUser appUser;
    @CreatedDate
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;
    @LastModifiedDate
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
    @OneToMany(mappedBy = "jobApplication", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RequirementJobApplication> requirementJobApplications;
    @OneToMany(mappedBy = "jobApplication", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<JobApplicationApproval> jobApplicationApprovals;
    @ManyToOne
    @JoinColumn(name = "job_profile_level_id", nullable = true)
    private JobProfileLevel jobProfileLevel;
    @OneToMany(mappedBy = "jobApplication", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<JobApplicationResumeUser> jobApplicationResumeUsers;

    @PrePersist
    private void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
        this.code = UUID.randomUUID().toString();
        if (Objects.isNull(this.active)) {
            this.active = Boolean.TRUE;
        }
    }

    @PreUpdate
    private void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}
