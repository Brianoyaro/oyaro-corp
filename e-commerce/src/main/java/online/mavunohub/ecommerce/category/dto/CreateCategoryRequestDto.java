package online.mavunohub.ecommerce.category.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import online.mavunohub.ecommerce.AttributeDefinitions.dto.CategoryAttributeRequestDto;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryRequestDto {
    private CategoryRequestDto category;
    private List<CategoryAttributeRequestDto> attributes;
}
