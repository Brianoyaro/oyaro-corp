package online.mavunohub.ecommerce.ProductImages.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private final String uploadDir = "uploads/";
    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"};

    public String saveFile(MultipartFile file) {
        log.info("Starting file upload: {}", file.getOriginalFilename());

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            log.warn("File upload rejected: Invalid content type - {}", contentType);
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            log.warn("File upload rejected: File size {} exceeds max size {}", file.getSize(), MAX_FILE_SIZE);
            throw new IllegalArgumentException("File size must not exceed 20MB");
        }

        // Validate file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidExtension(originalFilename)) {
            log.warn("File upload rejected: Invalid file extension - {}", originalFilename);
            throw new IllegalArgumentException("File format not supported. Allowed: jpg, jpeg, png, gif, webp");
        }

        try {
            String filename = UUID.randomUUID() + "_" + originalFilename;

            Path path = Paths.get(uploadDir + filename);
            Files.createDirectories(path.getParent());

            Files.write(path, file.getBytes());

            log.info("File uploaded successfully: {}", filename);
            return "/uploads/" + filename; // URL path
        } catch (IOException e) {
            log.error("File upload failed for: {}", originalFilename, e);
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    public void deleteFile(String fileUrl) {
        log.info("Starting file deletion: {}", fileUrl);
        try {
            // Extract filename from URL path: "/uploads/uuid_filename.jpg"
            String filename = fileUrl.substring("/uploads/".length());
            Path path = Paths.get(uploadDir + filename);
            Files.deleteIfExists(path);
            log.info("File deleted successfully: {}", filename);
        } catch (IOException e) {
            log.error("File deletion failed for: {}", fileUrl, e);
            throw new RuntimeException("File deletion failed: " + e.getMessage());
        }
    }

    private boolean isValidExtension(String filename) {
        String lowerFilename = filename.toLowerCase();
        for (String ext : ALLOWED_EXTENSIONS) {
            if (lowerFilename.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }
}


