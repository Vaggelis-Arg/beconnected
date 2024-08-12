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
    @JoinColumn(name = "requested_user_id")
    private User requestedUser;

    @ManyToOne
    @JoinColumn(name = "requesting_user_id")
    private User requestingUser;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ConnectionStatus status;

    @Column(name = "created_at")
    private LocalDate createdAt = LocalDate.now();
}

