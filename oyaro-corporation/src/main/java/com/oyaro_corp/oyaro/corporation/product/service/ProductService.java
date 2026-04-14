package com.oyaro_corp.oyaro.corporation.product.service;

import com.oyaro_corp.oyaro.corporation.category.entity.Category;
import com.oyaro_corp.oyaro.corporation.product.dto.CreateProductRequest;
import com.oyaro_corp.oyaro.corporation.product.dto.ProductResponse;
import com.oyaro_corp.oyaro.corporation.product.entity.Product;
import com.oyaro_corp.oyaro.corporation.product.entity.ProductImage;
import com.oyaro_corp.oyaro.corporation.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.oyaro_corp.oyaro.corporation.category.repository.CategoryRepository;
import org.springframework.web.multipart.MultipartFile;
import com.oyaro_corp.oyaro.corporation.product.dto.ImageResponse;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final FileStorageService fileService;

    public ProductService(ProductRepository productRepo,
                          CategoryRepository categoryRepo,
                          FileStorageService fileService) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.fileService = fileService;
    }

    // ✅ CREATE PRODUCT WITH IMAGES
    public ProductResponse createProduct(CreateProductRequest req,
                                         List<MultipartFile> images,
                                         Integer primaryIndex) {

        Category category = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setAttributes(req.getAttributes());
        product.setCategory(category);

        product = productRepo.save(product);

        List<ProductImage> imageEntities = new ArrayList<>();

        for (int i = 0; i < images.size(); i++) {
            MultipartFile file = images.get(i);

            String url = fileService.saveFile(file);

            ProductImage img = new ProductImage();
            img.setImageUrl(url);
            img.setProduct(product);
            img.setPrimary(i == primaryIndex);

            imageEntities.add(img);
        }

        product.getImages().addAll(imageEntities);

        product = productRepo.save(product);

        return mapToResponse(product);
    }

    // ✅ GET PRODUCT
    public ProductResponse getProduct(Long id) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return mapToResponse(p);
    }

    // ✅ DELETE PRODUCT
    public void deleteProduct(Long id) {
        productRepo.deleteById(id);
    }

    // ✅ ADD IMAGES
    public void addImages(Long productId, List<MultipartFile> files) {
        Product product = productRepo.findById(productId).orElseThrow();

        for (MultipartFile file : files) {
            String url = fileService.saveFile(file);

            ProductImage img = new ProductImage();
            img.setProduct(product);
            img.setImageUrl(url);
            img.setPrimary(false);

            product.getImages().add(img);
        }

        productRepo.save(product);
    }

    // ✅ DELETE IMAGE
    public void deleteImage(Long imageId) {
        productRepo.findAll().forEach(p ->
                p.getImages().removeIf(img -> img.getId().equals(imageId))
        );
    }

    // 🔁 MAPPER
    private ProductResponse mapToResponse(Product p) {
        ProductResponse res = new ProductResponse();
        res.setId(p.getId());
        res.setName(p.getName());
        res.setDescription(p.getDescription());
        res.setPrice(p.getPrice());
        res.setCategoryId(p.getCategory().getId());
        res.setAttributes(p.getAttributes());

        res.setImages(p.getImages().stream().map(img -> {
            ImageResponse ir = new ImageResponse();
            ir.setId(img.getId());
            ir.setImageUrl(img.getImageUrl());
            ir.setPrimary(img.getPrimary());
            return ir;
        }).toList());

        return res;
    }
}
