package com.beconnected.service;

import com.beconnected.repository.PictureRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class PictureService {

    private final PictureRepository pictureRepository;

    public void deletePicture(Long pictureId) {
        pictureRepository.deleteById(pictureId);
    }
}
