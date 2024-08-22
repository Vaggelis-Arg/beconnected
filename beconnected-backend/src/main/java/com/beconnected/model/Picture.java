package com.beconnected.model;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "picture")
public class Picture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "picture_id")
    private Long pictureId;

    @Lob
    @Column(name = "image_data", nullable = false, columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "content_type", nullable = false)
    private String contentType;
}
