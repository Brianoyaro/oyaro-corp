package online.mavunohub.ecommerce.AttributesValues.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProductAttributesRequestDto {
    private String attributeName;
    private String attributeValue;
}
