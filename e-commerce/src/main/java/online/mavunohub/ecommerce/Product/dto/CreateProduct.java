package online.mavunohub.ecommerce.Product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import online.mavunohub.ecommerce.AttributesValues.dto.ProductAttributesRequestDto;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProduct {
    private ProductRequestDto product;

    private List<ProductAttributesRequestDto> attributes;
}
