package com.beconnected.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "connection")
public class Connection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "connection_id")
    private Long connectionId;

    @ManyToOne
    @JoinColumn(name = "followed_id")
    private User followed;

    @ManyToOne
    @JoinColumn(name = "following_id")
    private User following;

    @Column(name = "created_at")
    private LocalDate createdAt = LocalDate.now();
}
