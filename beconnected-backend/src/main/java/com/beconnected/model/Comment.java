package com.beconnected.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "post_comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "comment_text", length = 10000, nullable = false)
    private String commentText;

    @Column(name = "commented_at", nullable = false)
    private LocalDateTime commentedAt = LocalDateTime.now();

    public Comment(Post post, User user, String commentText) {
        this.post = post;
        this.user = user;
        this.commentText = commentText;
    }
}
