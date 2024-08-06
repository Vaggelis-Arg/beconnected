package com.beconnected.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
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
    
    public void setImageData(byte[] imageData) {
        if (imageData.length > 4 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds the maximum allowed size of 4MB.");
        }
        this.imageData = imageData;
    }
}
