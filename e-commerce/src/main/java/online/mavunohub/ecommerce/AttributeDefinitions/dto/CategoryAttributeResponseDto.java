package online.mavunohub.ecommerce.AttributeDefinitions.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryAttributeResponseDto {
    private Long id;
    private String name;
}
