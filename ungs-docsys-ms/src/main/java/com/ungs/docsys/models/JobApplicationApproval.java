package com.ungs.docsys.models;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_application_approval", schema = "recruitment")
@Data
public class JobApplicationApproval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "job_application_id", nullable = false)
    private JobApplication jobApplication;
    @Column(nullable = true)
    private Boolean approved;
    @Column(nullable = false, length = 500)
    private String reason;
    @Column(name="users_approvers", nullable = true)
    private Integer[] usersApprovers;
    @ManyToOne
    @JoinColumn(name = "user_id_approval", nullable = false)
    private AppUser appUser;
    @CreatedDate
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;
    @LastModifiedDate
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    private void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    private void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}
