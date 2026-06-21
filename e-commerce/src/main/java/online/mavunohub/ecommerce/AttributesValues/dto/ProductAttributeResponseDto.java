package online.mavunohub.ecommerce.AttributesValues.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttributeResponseDto {
    private String attributeName;
    private String attributeValue;
}
