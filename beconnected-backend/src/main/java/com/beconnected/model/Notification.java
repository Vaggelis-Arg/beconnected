package com.beconnected.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "comment_message")
    private String commentMessage;

    @ManyToOne
    @JoinColumn(name = "connection_id")
    private Connection connection;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "triggered_by_user_id")
    private User triggeredByUser;

    public enum NotificationType {
        CONNECTION_REQUEST,
        LIKE,
        COMMENT
    }
}
