package online.mavunohub.ecommerce.category.dto;

import online.mavunohub.ecommerce.AttributeDefinitions.dto.CategoryAttributeResponseDto;
import online.mavunohub.ecommerce.Product.dto.ProductResponseDto;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponseDto {
    private Long id;
    private  String name;
    private String description;

    // list of attributeDefinitions
    List<CategoryAttributeResponseDto> attributes;

    // list of product DTOs
    List<ProductResponseDto> products;
}
