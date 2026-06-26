package online.mavunohub.ecommerce.ProductImages.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageResponseDto {
    private Long  id;
    private Boolean isPrimary;
    private String imgUrl;
}
