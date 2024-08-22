package com.beconnected.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@Entity
@Data
@Table(name = "job")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long jobId;

    @Column(nullable = false)
    private String title;

    @Column(length = 5000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userMadeBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(
            name = "job_applicants",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> applicants = new HashSet<>();

    @Column(nullable = false)
    private Boolean isActive;

    public Job(String title, String description, User userMadeBy, LocalDateTime createdAt, Boolean isActive) {
        this.title = title;
        this.description = description;
        this.userMadeBy = userMadeBy;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }

    public void addApplicant(User user) {
        this.applicants.add(user);
    }

    public void removeApplicant(User user) {
        this.applicants.remove(user);
    }
}
