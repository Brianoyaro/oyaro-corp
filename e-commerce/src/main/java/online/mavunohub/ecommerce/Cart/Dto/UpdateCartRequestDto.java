package online.mavunohub.ecommerce.Cart.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCartRequestDto {
    private Integer newQuantity;
}
