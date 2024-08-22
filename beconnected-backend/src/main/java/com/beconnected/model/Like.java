package com.beconnected.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "post_likes")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long likeId;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "liked_at", nullable = false)
    private LocalDateTime likedAt = LocalDateTime.now();

    public Like(Post post, User user) {
        this.post = post;
        this.user = user;
    }
}