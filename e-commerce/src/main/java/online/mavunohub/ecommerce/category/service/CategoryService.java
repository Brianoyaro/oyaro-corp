package online.mavunohub.ecommerce.category.service;

import online.mavunohub.ecommerce.AttributeDefinitions.dto.CategoryAttributeRequestDto;
import online.mavunohub.ecommerce.AttributeDefinitions.dto.CategoryAttributeResponseDto;
import online.mavunohub.ecommerce.AttributeDefinitions.model.CategoryAttribute;
import online.mavunohub.ecommerce.AttributeDefinitions.repository.CategoryAttributeDefinitionsRepo;
import online.mavunohub.ecommerce.AttributesValues.dto.ProductAttributeResponseDto;
import online.mavunohub.ecommerce.AttributesValues.model.ProductAttributeValues;
import online.mavunohub.ecommerce.AttributesValues.repository.ProductAttributesValuesRepo;
import online.mavunohub.ecommerce.Product.dto.ProductResponseDto;
import online.mavunohub.ecommerce.Product.model.Product;
import online.mavunohub.ecommerce.ProductImages.dto.ProductImageResponseDto;
import online.mavunohub.ecommerce.ProductImages.model.ProductImage;
import online.mavunohub.ecommerce.category.dto.CategoryRequestDto;
import online.mavunohub.ecommerce.category.dto.CategoryResponseDto;
import online.mavunohub.ecommerce.category.model.Category;
import online.mavunohub.ecommerce.category.respository.CategoryRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    private final CategoryRepo categoryRepo;
    private final CategoryAttributeDefinitionsRepo categoryAttributeDefinitionsRepo;
    private final ProductAttributesValuesRepo productAttributesValuesRepo;

    // Create
    public CategoryResponseDto createCategory(CategoryRequestDto categoryRequestDto, List<CategoryAttributeRequestDto> categoryAttributeRequestDtoList) {
        try {
            log.info("createCategory");
            Category category = Category.builder()
                    .name(categoryRequestDto.getCategoryName())
                    .description(categoryRequestDto.getCategoryDescription())
                    .build();
            Category savedCategory = categoryRepo.save(category);
            log.info("Category with ID: {} created successfully", savedCategory.getId());

            // attach attributes
            List<CategoryAttribute> categoryAttributes = new ArrayList<>();

            Category finalSavedCategory = savedCategory;
            categoryAttributeRequestDtoList.forEach(categoryAttributeRequestDto -> {
                // confirm if a category attribute with that name exists
                List<CategoryAttribute> categoryAttributeListInDatabase = categoryAttributeDefinitionsRepo.findByCategory(category);
                categoryAttributeListInDatabase.forEach(categoryAttribute -> {
                    if (categoryAttribute.getName().equals(categoryAttributeRequestDto.getName())){
                        log.error("Attribute with name: {} for category: {} already exists", categoryAttributeRequestDto.getName(), category.getName());
                        throw new RuntimeException("Attribute with name: " + categoryAttributeRequestDto.getName() + "for Category: " + category.getName() + " already exists.");
                    }
                });

                // create a categoryAttribute
                CategoryAttribute categoryAttribute =  CategoryAttribute.builder()
                        .name(categoryAttributeRequestDto.getName())
                        .category(finalSavedCategory)
                        .build();
                // save to the database
                categoryAttribute = categoryAttributeDefinitionsRepo.save(categoryAttribute);
                // add the category attribute to the return list
                categoryAttributes.add(categoryAttribute);
            });
            //
            finalSavedCategory.setAttributes(categoryAttributes);
            savedCategory = categoryRepo.save(finalSavedCategory);
            return mapper(finalSavedCategory);
        } catch (Exception e) {
            log.error("Error creating a new category. Error Message: {}", e.getMessage());
            log.error("StackTrace: {}", (Object) e.getStackTrace());
            throw e;
        }
    }

    private CategoryResponseDto mapper(Category category) {
        List<ProductResponseDto> productResponseDtos = getProductResponseDtos(category);

        List<CategoryAttributeResponseDto> categoryAttributeResponseDtos = getCategoryAttributeResponseDtos(category);

        return CategoryResponseDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .products(productResponseDtos)
                .attributes(categoryAttributeResponseDtos)
                .build();
    }

    private  @NonNull List<CategoryAttributeResponseDto> getCategoryAttributeResponseDtos(Category category) {
        List<CategoryAttributeResponseDto> categoryAttributeResponseDtos = new ArrayList<>();
        List<CategoryAttribute> attributes = category.getAttributes();
        attributes.forEach(attribute -> {
            CategoryAttributeResponseDto categoryAttributeResponseDto = CategoryAttributeResponseDto.builder()
                    .id(attribute.getId())
                    .name(attribute.getName())
                    .build();
            categoryAttributeResponseDtos.add(categoryAttributeResponseDto);
        });
        return categoryAttributeResponseDtos;
    }

    private @NonNull List<ProductResponseDto> getProductResponseDtos(Category category) {
        List<Product> products = category.getProducts();
        List<ProductResponseDto> productResponseDtos = new ArrayList<>();

        products.forEach(product -> {
            // list of image URLs
            List<ProductImageResponseDto> images = getProductImageDto(product);
            // list of product-attributes
            List<ProductAttributeResponseDto> attributes = getProductAttributeDto(product);

            ProductResponseDto productResponseDto = ProductResponseDto.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .categoryName(product.getCategory().getName())
                    .images(images)
                    .attributes(attributes)
                    .build();
            productResponseDtos.add(productResponseDto);
        });
        return productResponseDtos;
    }

    private List<ProductAttributeResponseDto> getProductAttributeDto(Product product) {
        List<ProductAttributeResponseDto> productAttributeResponseDtos = new ArrayList<>();
        List<ProductAttributeValues> productAttributes = product.getAttributes();
        productAttributes.forEach(productAttribute -> {
            ProductAttributeResponseDto productAttributeResponseDto = ProductAttributeResponseDto.builder()
                    .attributeName(productAttribute.getCategoryAttribute().getName())
                    .attributeValue(productAttribute.getValue())
                    .build();
            productAttributeResponseDtos.add(productAttributeResponseDto);
        });
        return productAttributeResponseDtos;
    }

    private List<ProductImageResponseDto> getProductImageDto(Product product) {
        List<ProductImageResponseDto> productImageResponseDtos = new ArrayList<>();
        List<ProductImage> images = product.getProductImages();

        images.forEach(img -> {
            ProductImageResponseDto productImageResponseDto = ProductImageResponseDto.builder()
                    .id(img.getId())
                    .isPrimary(img.getIsPrimary())
                    .imgUrl(img.getImgUrl())
                    .build();
            productImageResponseDtos.add(productImageResponseDto);
        });
        //
        return productImageResponseDtos;
    }


    // Get all
    public List<CategoryResponseDto> getAllCategories() {
        try {
            List<Category> categories = categoryRepo.findAll();
            return categories.stream()
                    .map(this::mapper)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting all categories.");
            log.error("StackTrace: {}", (Object) e.getStackTrace());
            throw e;
        }
    }

    // Get One
    public CategoryResponseDto getOneCategory(Long id) {
        try {
            Category category = categoryRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category with ID: " + id + " Not found."));
            return mapper(category);
        } catch (Exception e) {
            log.error("Error getting category by ID.");
            log.error("StackTrace: {}", (Object) e.getStackTrace());
            throw e;
        }
    }

    // delete
    public void deleteCategory(Long id) {
        try {
            log.info("Deleting category with ID: {}", id);

            Category category = categoryRepo.findById(id)
                            .orElseThrow(() -> new RuntimeException("Category with ID: " + id + " Not found."));

            category.getAttributes().forEach(attribute -> {
                categoryAttributeDefinitionsRepo.delete(attribute);
            });

            categoryRepo.delete(category);
            log.info("Category with ID: {} deleted successfully", id);
        } catch (Exception e) {
            log.error("Error deleting category.");
            log.error("StackTrace: {}", (Object) e.getStackTrace());
            throw e;
        }
    }

    /*// Update
    public CategoryResponseDto updateCategory(
            Long id,
            CategoryRequestDto categoryRequestDto,
            List<CategoryAttributeRequestDto> categoryAttributeRequestDtoList
    ) {
        try {
            Category category = categoryRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category with ID: " + id + " Not found."));

            // update category info
            if (categoryRequestDto.getCategoryName() != null) {
                if (!categoryRequestDto.getCategoryName().equalsIgnoreCase(category.getName())) {
                    category.setName(categoryRequestDto.getCategoryName());
                }
            }
            if (categoryRequestDto.getCategoryDescription() != null) {
                category.setDescription(categoryRequestDto.getCategoryDescription());
            }
            category = categoryRepo.save(category);

            // update category Attributes
            List<String> categoryAttributeNames = category.getAttributes().stream()
                    .map(CategoryAttribute::getName)
                    .toList();
            Set<String> categoryAttributeNamesSet = new HashSet<>(categoryAttributeNames);

            Category finalCategory = category;
            categoryAttributeRequestDtoList.forEach(categoryAttributeRequestDto -> {
                if (!categoryAttributeNamesSet.contains(categoryAttributeRequestDto.getName())) {
                    CategoryAttribute categoryAttribute =  CategoryAttribute.builder()
                            .name(categoryAttributeRequestDto.getName())
                            .category(finalCategory)
                            .build();

                    categoryAttribute = categoryAttributeDefinitionsRepo.save(categoryAttribute);
                    finalCategory.getAttributes().add(categoryAttribute);
                }
            });
            category = categoryRepo.save(finalCategory);

            return mapper(finalCategory);
        } catch (Exception e) {
            log.error("Error updating category.");
            log.error("StackTrace: {}", (Object) e.getStackTrace());
            throw e;
        }
    }*/
    public CategoryResponseDto updateCategory(
            Long id,
            CategoryRequestDto categoryRequestDto,
            List<CategoryAttributeRequestDto> categoryAttributeRequestDtoList
    ) {
        try {
            Category category = categoryRepo.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Category with ID: " + id + " not found."));

            // =====================================================
            // UPDATE CATEGORY DETAILS
            // =====================================================

            if (categoryRequestDto.getCategoryName() != null
                    && !categoryRequestDto.getCategoryName().trim().isEmpty()
                    && !categoryRequestDto.getCategoryName().equalsIgnoreCase(category.getName())) {

                category.setName(categoryRequestDto.getCategoryName().trim());
            }

            if (categoryRequestDto.getCategoryDescription() != null) {
                category.setDescription(categoryRequestDto.getCategoryDescription());
            }

            // =====================================================
            // FILTER INVALID ATTRIBUTES
            // =====================================================

            List<CategoryAttributeRequestDto> validAttributes =
                    categoryAttributeRequestDtoList.stream()
                            .filter(attr ->
                                    attr.getName() != null &&
                                            !attr.getName().trim().isEmpty()
                            )
                            .toList();

            // =====================================================
            // INCOMING ATTRIBUTE NAMES
            // =====================================================

            Set<String> incomingNames = validAttributes.stream()
                    .map(attr -> attr.getName().trim().toLowerCase())
                    .collect(Collectors.toSet());

            // =====================================================
            // DELETE REMOVED ATTRIBUTES
            // =====================================================

            List<CategoryAttribute> attributesToRemove =
                    category.getAttributes().stream()
                            .filter(attr ->
                                    !incomingNames.contains(
                                            attr.getName().toLowerCase()
                                    )
                            )
                            .toList();

            for (CategoryAttribute attributeToRemove : attributesToRemove) {

                log.warn("Removing category attribute: {}", attributeToRemove.getName());

                // First remove all ProductAttributeValues
                productAttributesValuesRepo
                        .deleteAllByCategoryAttribute(attributeToRemove);

                // Remove from category collection
                category.getAttributes().remove(attributeToRemove);

                // Delete CategoryAttribute itself
//                categoryAttributeDefinitionsRepo.delete(attributeToRemove);
                long usageCount =
                        productAttributesValuesRepo.countByCategoryAttribute(attributeToRemove);

                if (usageCount > 0) {
                    productAttributesValuesRepo.deleteAllByCategoryAttribute(attributeToRemove);
                }

                categoryAttributeDefinitionsRepo.delete(attributeToRemove);
            }

            // =====================================================
            // ADD NEW ATTRIBUTES
            // =====================================================

            Set<String> existingNames = category.getAttributes().stream()
                    .map(attr -> attr.getName().toLowerCase())
                    .collect(Collectors.toSet());

            for (CategoryAttributeRequestDto dto : validAttributes) {

                String attributeName = dto.getName().trim();

                if (!existingNames.contains(attributeName.toLowerCase())) {

                    CategoryAttribute categoryAttribute =
                            CategoryAttribute.builder()
                                    .name(attributeName)
                                    .category(category)
                                    .build();

                    categoryAttribute =
                            categoryAttributeDefinitionsRepo.save(categoryAttribute);

                    category.getAttributes().add(categoryAttribute);

                    log.info("Added category attribute: {}", attributeName);
                }
            }

            category = categoryRepo.save(category);

            return mapper(category);

        } catch (Exception e) {
            log.error("Error updating category", e);
            throw e;
        }
    }
}
