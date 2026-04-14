package com.oyaro_corp.oyaro.corporation.product.controller;

import com.oyaro_corp.oyaro.corporation.product.dto.CreateProductRequest;
import com.oyaro_corp.oyaro.corporation.product.dto.ProductResponse;
import com.oyaro_corp.oyaro.corporation.product.service.ProductService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;
    private final ObjectMapper objectMapper;

    public ProductController(ProductService service, ObjectMapper objectMapper) {
        this.service = service;
        this.objectMapper = objectMapper;
    }

    // ✅ CREATE PRODUCT WITH IMAGES
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse createProduct(
            @RequestPart("product") String productJson,
            @RequestPart("images") List<MultipartFile> images,
            @RequestParam(defaultValue = "0") Integer primaryIndex
    ) throws Exception {

        CreateProductRequest req =
                objectMapper.readValue(productJson, CreateProductRequest.class);

        return service.createProduct(req, images, primaryIndex);
    }

    // ✅ GET PRODUCT
    @GetMapping("/{id}")
    public ProductResponse get(@PathVariable Long id) {
        return service.getProduct(id);
    }

    // ✅ DELETE PRODUCT
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteProduct(id);
    }

    // ✅ ADD IMAGES
    @PostMapping("/{id}/images")
    public void addImages(
            @PathVariable Long id,
            @RequestPart List<MultipartFile> images
    ) {
        service.addImages(id, images);
    }

    // ✅ DELETE IMAGE
    @DeleteMapping("/images/{imageId}")
    public void deleteImage(@PathVariable Long imageId) {
        service.deleteImage(imageId);
    }
}
