package online.mavunohub.ecommerce.Product.service;

import online.mavunohub.ecommerce.AttributeDefinitions.model.CategoryAttribute;
import online.mavunohub.ecommerce.AttributeDefinitions.repository.CategoryAttributeDefinitionsRepo;
import online.mavunohub.ecommerce.AttributesValues.dto.ProductAttributeResponseDto;
import online.mavunohub.ecommerce.AttributesValues.dto.ProductAttributesRequestDto;
import online.mavunohub.ecommerce.AttributesValues.model.ProductAttributeValues;
import online.mavunohub.ecommerce.AttributesValues.repository.ProductAttributesValuesRepo;
import online.mavunohub.ecommerce.Product.dto.ProductRequestDto;
import online.mavunohub.ecommerce.Product.dto.ProductResponseDto;
import online.mavunohub.ecommerce.Product.dto.UpdateProductRequestDto;
import online.mavunohub.ecommerce.Product.model.Product;
import online.mavunohub.ecommerce.Product.repository.ProductRepo;
import online.mavunohub.ecommerce.ProductImages.dto.ProductImageResponseDto;
import online.mavunohub.ecommerce.ProductImages.model.ProductImage;
import online.mavunohub.ecommerce.ProductImages.respository.ProductImagesRepo;
import online.mavunohub.ecommerce.ProductImages.service.FileStorageService;
import online.mavunohub.ecommerce.category.model.Category;
import online.mavunohub.ecommerce.category.respository.CategoryRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductService {
    private final ProductRepo  productRepo;
    private final CategoryRepo categoryRepo;
    private final ProductImagesRepo productImagesRepo;
    private final FileStorageService fileStorageService;
    private final ProductAttributesValuesRepo productAttributesValuesRepo;
    private final CategoryAttributeDefinitionsRepo categoryAttributeDefinitionsRepo;

    // CREATE
    public ProductResponseDto createProduct(
            ProductRequestDto productRequest,
            List<ProductAttributesRequestDto> productAttributesRequestList,
            List<MultipartFile> imageFiles
    ) {
        try {
            log.error("Create product request. product attributes has {} elements",  productAttributesRequestList.size());
            Category category = categoryRepo.findById(productRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category with ID: " + productRequest.getCategoryId() + "not found"));
            // Create a product
            Product product = Product.builder()
                    .name(productRequest.getName())
                    .description(productRequest.getDescription())
                    .price(productRequest.getPrice())
                    .category(category)
                    //.productImages() Todo[DONE]. They are attached below.
                    //.attributes() Todo[DONE]. They are attached below.
                    .build();
            product = productRepo.save(product);

            attachImages(product, imageFiles, false);
            attachAttributes(product, productAttributesRequestList);
            product = productRepo.save(product);

            category = category.appendProductToProductList(product);
            categoryRepo.save(category);

            // call mapper
            return mapper(product);
        } catch (Exception e) {
            log.error("Error while creating product.");
            throw e;
        }
    }

//    private void attachImages(Product product, List<MultipartFile> imageFiles, Boolean isUpdateOperation) {
//        log.info(imageFiles.toString());
//        log.info("Attaching images to the product.");
//
//        List<ProductImage> productImages = new ArrayList<>();
//
//        if (isUpdateOperation) {
//            productImages = product.getProductImages();
//        };
//        log.warn("attaching {} images. object initially has {} images", imageFiles.size(), productImages.size());
//        for (MultipartFile file : imageFiles) {
//            String url = fileStorageService.saveFile(file);
//            ProductImage productImage = ProductImage.builder()
//                    .product(product)
//                    .imgUrl(url)
//                    .isPrimary(false)
//                    .build();
//            productImage = productImagesRepo.save(productImage);
//            productImages.add(productImage);
//        }
//        productImages.getFirst().setIsPrimary(true);
//        product.setProductImages(productImages);
//        if (productImages != null) {
//            log.info("Attached {} images to the product.",  productImages.size());//Todo: this fails when productImages is null
//        }
//    }

    private void attachImages(Product product,
                              List<MultipartFile> imageFiles,
                              Boolean isUpdateOperation) {

        if (imageFiles == null || imageFiles.isEmpty()) {
            log.info("No images supplied.");
            return;
        }

        List<ProductImage> productImages =
                isUpdateOperation
                        ? new ArrayList<>(product.getProductImages())
                        : new ArrayList<>();

        log.warn(
                "Attaching {} images. Product initially has {} images",
                imageFiles.size(),
                productImages.size()
        );

        for (MultipartFile file : imageFiles) {
            String url = fileStorageService.saveFile(file);

            ProductImage image = ProductImage.builder()
                    .product(product)
                    .imgUrl(url)
                    .isPrimary(false)
                    .build();

            productImages.add(image);
        }

        productImages.forEach(img -> img.setIsPrimary(false));

        if (!productImages.isEmpty()) {
            productImages.getFirst().setIsPrimary(true);
        }

        product.setProductImages(productImages);

        log.info("Attached {} images to the product.", productImages.size());
    }

    private void attachAttributes(Product product, List<ProductAttributesRequestDto> productAttributesRequestList) {
        log.info("Attaching attributes to the product.");
        Category category = product.getCategory();

        List<ProductAttributeValues> productAttributeValuesList = new ArrayList<>();
        for (ProductAttributesRequestDto productAttributesRequestDto : productAttributesRequestList) {
            CategoryAttribute categoryAttribute = null;
            List<CategoryAttribute> categoryAttributes = categoryAttributeDefinitionsRepo.findByCategory(category);
            log.warn("found {} attributes for {} category", categoryAttributes.size(), category.getName());
            for (CategoryAttribute catAttr : categoryAttributes) {
                log.warn("comparing {} to {}", catAttr.getName(), productAttributesRequestDto.getAttributeName());
                if (catAttr.getName().equalsIgnoreCase(productAttributesRequestDto.getAttributeName())) {
                    categoryAttribute = catAttr;
                    log.warn("Found attribute with name " + productAttributesRequestDto.getAttributeName()+ "category attr name "+ catAttr.getName());
                    break;
                }
            }
            ProductAttributeValues productAttribute = ProductAttributeValues.builder()
                    .product(product)
                    .value(productAttributesRequestDto.getAttributeValue())
                    .categoryAttribute(categoryAttribute)//TODO
                    .build();
            productAttributeValuesList.add(productAttribute);
            productAttributesValuesRepo.save(productAttribute);
        }
        product.setAttributes(productAttributeValuesList);
        log.info("Attached {} attributes to the product.",  productAttributeValuesList.size());
    }

    // Get all products
    public List<ProductResponseDto> getProducts() {
        try {
            List<Product> products = productRepo.findAll();
            return products.stream()
                    .map(this::mapper)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error while getting products.");
            throw e;
        }
    }

    // Get one product
    public ProductResponseDto getProduct(Long id) {
        try {
            Product product = productRepo.findById(id).orElseThrow(() -> new RuntimeException("Product with ID: " + id + " not found"));
            return mapper(product);
        } catch (Exception e) {
            log.error("Error while getting product.");
            throw e;
        }
    }

    // Delete a product
    public void deleteProduct(Long id) {
        try {
            Product product = productRepo.findById(id).orElseThrow(() -> new RuntimeException("Product with ID: " + id + " not found"));
            // delete product attributes
//            product.getAttributes().forEach(productAttributeValues -> {
//                productAttributesValuesRepo.delete(productAttributeValues);
//            });
            // delete product images
            product.getProductImages().forEach(productImage -> {
                // delete the image from the file system
                fileStorageService.deleteFile(productImage.getImgUrl());
//                productImagesRepo.delete(productImage);
            });
            productRepo.delete(product);
            //productRepo.deleteById(id);
        } catch (Exception e) {
            log.error("Error while deleting product.");
            throw e;
        }
    }

    //Update a product
    public ProductResponseDto updateProduct(
            Long productId,
            UpdateProductRequestDto productUpdateRequest,
            List<String> imageUrlsToKeep,
            List<MultipartFile> newImageFiles,
            List<ProductAttributesRequestDto> productAttributesRequestList
    ) {
        try {
            Product product = productRepo.findById(productId).orElseThrow(() -> new RuntimeException("Product with ID: " + productId + " not found"));
            // update primary details
            if  (productUpdateRequest.getName() != null) {
                product.setName(productUpdateRequest.getName());
            }
            if (productUpdateRequest.getDescription() != null) {
                product.setDescription(productUpdateRequest.getDescription());
            }
            if (productUpdateRequest.getPrice() != null) {
                product.setPrice(productUpdateRequest.getPrice());
            }

            // update images
            Set<String> imagesToKeepSet = new HashSet<>(imageUrlsToKeep);
            /* get a list of product images to remove by filtering the product images against images to keep list. I converted it from a list to a set because set offers faster lookup O(1) compared to list which has O(n).*/
            List<ProductImage> imagesToRemove = product.getProductImages().stream()
                    .filter(img -> !imagesToKeepSet.contains(img.getImgUrl()))
                    .toList();
            // remove the images from collection if it does not follow the set predicate
            product.getProductImages().removeIf(img -> !imagesToKeepSet.contains(img.getImgUrl()));

            // remove the images from the filesystem
            imagesToRemove.forEach(productImage -> {
                fileStorageService.deleteFile(productImage.getImgUrl());
                //productImagesRepo.delete(productImage);
            });

            // attach new images
            attachImages(product, newImageFiles, true);
            productRepo.save(product);

            log.info("Starting to update attributes for product {}", productId);

            /*
             * Frontend attribute names
             */
            Set<String> incomingAttributeNames =
                    productAttributesRequestList.stream()
                            .map(attr -> attr.getAttributeName().toLowerCase())
                            .collect(Collectors.toSet());

            /*
             * Remove attributes deleted on frontend
             */
            product.getAttributes().removeIf(existingAttribute ->
                    !incomingAttributeNames.contains(
                            existingAttribute.getCategoryAttribute()
                                    .getName()
                                    .toLowerCase()
                    )
            );

            /*
             * Build lookup map for existing attributes
             */
            Map<String, ProductAttributeValues> existingAttributes =
                    product.getAttributes()
                            .stream()
                            .collect(Collectors.toMap(
                                    attr -> attr.getCategoryAttribute()
                                            .getName()
                                            .toLowerCase(),
                                    Function.identity()
                            ));

            /*
             * Category attributes lookup
             */
            Map<String, CategoryAttribute> categoryAttributesMap =
                    product.getCategory()
                            .getAttributes()
                            .stream()
                            .collect(Collectors.toMap(
                                    attr -> attr.getName().toLowerCase(),
                                    Function.identity()
                            ));

            /*
             * Update existing attributes or create new ones
             */
            for (ProductAttributesRequestDto incomingAttr : productAttributesRequestList) {

                String attributeName =
                        incomingAttr.getAttributeName().toLowerCase();

                ProductAttributeValues existing =
                        existingAttributes.get(attributeName);

                if (existing != null) {

                    /*
                     * Update existing value
                     */
                    existing.setValue(incomingAttr.getAttributeValue());

                } else {

                    /*
                     * Create new attribute
                     */
                    CategoryAttribute categoryAttribute =
                            categoryAttributesMap.get(attributeName);

                    if (categoryAttribute == null) {
                        throw new RuntimeException(
                                "Category attribute '" +
                                        incomingAttr.getAttributeName() +
                                        "' does not exist"
                        );
                    }

                    ProductAttributeValues newAttribute =
                            ProductAttributeValues.builder()
                                    .product(product)
                                    .categoryAttribute(categoryAttribute)
                                    .value(incomingAttr.getAttributeValue())
                                    .build();

                    product.getAttributes().add(newAttribute);
                }
            }

            /*
             * Save once
             */
            product = productRepo.save(product);
            return mapper(product);
        } catch (Exception e) {
            log.error("Error while updating product.");
            throw e;
        }
    }

    private ProductResponseDto mapper(Product product) {
        List<ProductImageResponseDto> productImageResponseDtoList = new ArrayList<>();
        List<ProductAttributeResponseDto> productAttributeResponseDtoList = new ArrayList<>();

        //images
        product.getProductImages().forEach(productImage -> {
            ProductImageResponseDto productImageResponseDto =  ProductImageResponseDto.builder()
                    .id(productImage.getId())
                    .imgUrl(productImage.getImgUrl())
                    .isPrimary(productImage.getIsPrimary())
                    .build();
            productImageResponseDtoList.add(productImageResponseDto);
        });
        //attributes
        product.getAttributes().forEach(productAttribute -> {
            log.warn("productattributevalue: {}", productAttribute);
            ProductAttributeResponseDto productAttributeResponseDto = ProductAttributeResponseDto.builder()
                    .attributeName(productAttribute.getCategoryAttribute().getName())
                    .attributeValue(productAttribute.getValue())
                    .build();
            productAttributeResponseDtoList.add(productAttributeResponseDto);
        });

        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .categoryName(product.getCategory().getName())
                .categoryId(product.getCategory().getId())
                .images(productImageResponseDtoList)
                .attributes(productAttributeResponseDtoList)
                .build();
    }
}
