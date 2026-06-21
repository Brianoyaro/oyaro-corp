package online.mavunohub.ecommerce.Product.controller;

import online.mavunohub.ecommerce.AttributesValues.dto.ProductAttributesRequestDto;
import online.mavunohub.ecommerce.Product.dto.CreateProduct;
import online.mavunohub.ecommerce.Product.dto.ProductRequestDto;
import online.mavunohub.ecommerce.Product.dto.ProductResponseDto;
import online.mavunohub.ecommerce.Product.dto.UpdateProductRequestDto;
import online.mavunohub.ecommerce.Product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.core.JsonParser;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {
    private final ProductService productService;
    private final ObjectMapper objectMapper;

    // CREATE
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart("attributes") String productAttributesJson,
            @RequestPart("images")List<MultipartFile> images
            ) {
        try {
            log.info("In product controller, creating a new product.");
            ProductRequestDto productRequest = objectMapper.readValue(productJson, ProductRequestDto.class);
            List<ProductAttributesRequestDto> productAttributesList =
                    objectMapper.readValue(
                            productAttributesJson,
                            new TypeReference<List<ProductAttributesRequestDto>>() {}
                    );
            ProductResponseDto response = productService.createProduct(productRequest, productAttributesList,images);

            log.info("Product created successfully.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Error Message", e.getMessage());
            log.error("IllegalArgumentsException Error occurred when creating product. Error Message: {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Error Message", e.getMessage());
            log.error("Error occurred when creating product. Error Message: {}",e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("Internal Server Error Message: ", e.getMessage());
            log.error("Unexpected error occurred when creating product", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Update
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") String productUpdateJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> newImageFiles,
            @RequestPart("attributes") String productAttributesJson,
            @RequestPart("imagesToKeep") String imageUrlsToKeepList
    ){
        try {
            UpdateProductRequestDto productUpdateRequest =
                    objectMapper.readValue(productUpdateJson, UpdateProductRequestDto.class);

            List<ProductAttributesRequestDto> productAttributesRequestList =
                    objectMapper.readValue(
                            productAttributesJson,
                            new TypeReference<List<ProductAttributesRequestDto>>() {}
                    );

            List<String> imageUrlsToKeep = objectMapper.readValue(
                    imageUrlsToKeepList,
                    new TypeReference<List<String>>() {}
            );
            log.warn("images to keep list has {} elements", imageUrlsToKeep.size());

            ProductResponseDto response = productService.updateProduct(
                    id,
                    productUpdateRequest,
                    imageUrlsToKeep,
                    newImageFiles,
                    productAttributesRequestList
            );
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Error Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Error Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get ONE
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id){
        try {
            ProductResponseDto response = productService.getProduct(id);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Error Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Error Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get ALL
    @GetMapping
    public ResponseEntity<?> getProducts(){
        try {
            List<ProductResponseDto> response = productService.getProducts();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Error Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id){
        try {
            productService.deleteProduct(id);
            Map<String, Object> response = new HashMap<>();
            response.put("Message", "The product was successfully deleted.");
            log.info("Product deleted successfully.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Error Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Error Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
