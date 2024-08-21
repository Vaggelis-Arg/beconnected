package com.beconnected.service;

import com.beconnected.model.Picture;
import com.beconnected.repository.PictureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class PictureService {

    @Autowired
    private PictureRepository pictureRepository;

    public void deletePicture(Long pictureId) {
        pictureRepository.deleteById(pictureId);
    }
}
