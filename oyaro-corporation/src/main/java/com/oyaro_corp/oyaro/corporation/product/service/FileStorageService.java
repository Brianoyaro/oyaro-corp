package com.oyaro_corp.oyaro.corporation.product.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads/";

    public String saveFile(MultipartFile file) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path path = Paths.get(uploadDir + filename);
            Files.createDirectories(path.getParent());

            Files.write(path, file.getBytes());

            return "/uploads/" + filename; // URL path
        } catch (IOException e) {
            throw new RuntimeException("File upload failed");
        }
    }
}
