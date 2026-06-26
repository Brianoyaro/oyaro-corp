package online.mavunohub.ecommerce.paystack.Dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaystackResponseDto {
    private Long orderId;
    private String reference;
    private String accessCode;
    private String authorizationUrl;
}
