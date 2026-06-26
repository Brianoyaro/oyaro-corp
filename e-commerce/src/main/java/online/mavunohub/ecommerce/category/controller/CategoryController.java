package online.mavunohub.ecommerce.category.controller;

import lombok.extern.slf4j.Slf4j;
import online.mavunohub.ecommerce.AttributeDefinitions.dto.CategoryAttributeRequestDto;
import online.mavunohub.ecommerce.category.dto.CategoryRequestDto;
import online.mavunohub.ecommerce.category.dto.CategoryResponseDto;
import online.mavunohub.ecommerce.category.dto.CreateCategoryRequestDto;
import online.mavunohub.ecommerce.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    //CREATE
    @PostMapping("/create")
    public ResponseEntity<?> createCategory(@RequestBody CreateCategoryRequestDto request) {
        try {
            CategoryRequestDto categoryRequestDto = request.getCategory();
            List<CategoryAttributeRequestDto> categoryAttributeRequestDtoList = request.getAttributes();

            CategoryResponseDto categoryResponseDto = categoryService.createCategory(categoryRequestDto, categoryAttributeRequestDtoList);

            return ResponseEntity.status(HttpStatus.CREATED).body(categoryResponseDto);

            // Catch other error from the service class
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("Error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            // Internal server error
            Map<String, Object> error = new HashMap<>();
            error.put("Message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get ALL categories
    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        try {
            List<CategoryResponseDto> categoryResponseDtos = categoryService.getAllCategories();
            return ResponseEntity.status(HttpStatus.OK).body(categoryResponseDtos);
        } catch (Exception e) {
            // Internal server error
            Map<String, Object> error = new HashMap<>();
            error.put("Message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get One
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategory(@PathVariable Long id) {
        try {
            CategoryResponseDto categoryResponseDto = categoryService.getOneCategory(id);
            return ResponseEntity.status(HttpStatus.OK).body(categoryResponseDto);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("Error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            // Internal server error
            Map<String, Object> error = new HashMap<>();
            error.put("Message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            Map<String, Object> response = new HashMap<>();
            response.put("Message", "Category with ID: " + id + " was deleted successfully.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("Error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            // Internal server error
            Map<String, Object> error = new HashMap<>();
            error.put("Message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CreateCategoryRequestDto request) {
        try {
            CategoryRequestDto categoryRequestDto = request.getCategory();
            List<CategoryAttributeRequestDto> categoryAttributeRequestDtoList = request.getAttributes();

            CategoryResponseDto categoryResponseDto = categoryService.updateCategory(id, categoryRequestDto, categoryAttributeRequestDtoList);

            return ResponseEntity.status(HttpStatus.OK).body(categoryResponseDto);

            // Catch other error from the service class
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("Error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            // Internal server error
            Map<String, Object> error = new HashMap<>();
            error.put("Message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
