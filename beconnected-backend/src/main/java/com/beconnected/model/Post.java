package com.beconnected.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Entity
@Data
@Table(name = "post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @Column(length = 10000)
    private String textContent;

    @Lob
    @Column(name = "media_content", columnDefinition = "LONGBLOB")
    private byte[] mediaContent;

    @Column(name = "media_type")
    private String mediaType;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Post(String textContent, byte[] mediaContent, String mediaType, User author) {
        this.textContent = textContent;
        this.mediaContent = mediaContent;
        this.mediaType = mediaType;
        this.author = author;
    }
}
