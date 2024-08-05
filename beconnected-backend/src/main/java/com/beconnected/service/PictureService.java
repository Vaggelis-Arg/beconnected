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

    // Save or update a picture
    public Picture saveOrUpdatePicture(MultipartFile file, Picture existingPicture) throws IOException {
        if (existingPicture != null) {
            existingPicture.setImageData(file.getBytes());
            existingPicture.setFileName(file.getOriginalFilename());
            existingPicture.setContentType(file.getContentType());
            return pictureRepository.save(existingPicture);
        } else {
            Picture picture = new Picture();
            picture.setImageData(file.getBytes());
            picture.setFileName(file.getOriginalFilename());
            picture.setContentType(file.getContentType());
            return pictureRepository.save(picture);
        }
    }

    public void deletePicture(Long pictureId) {
        pictureRepository.deleteById(pictureId);
    }

    public Optional<Picture> findPictureById(Long pictureId) {
        return pictureRepository.findById(pictureId);
    }
}
