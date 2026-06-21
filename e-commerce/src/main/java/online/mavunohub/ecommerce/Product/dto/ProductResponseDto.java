package online.mavunohub.ecommerce.Product.dto;

import online.mavunohub.ecommerce.AttributesValues.dto.ProductAttributeResponseDto;
import online.mavunohub.ecommerce.ProductImages.dto.ProductImageResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;

    private String categoryName;

    // list of image URLs
    List<ProductImageResponseDto> images;

    // list of product-attributes
    private List<ProductAttributeResponseDto> attributes;
}
