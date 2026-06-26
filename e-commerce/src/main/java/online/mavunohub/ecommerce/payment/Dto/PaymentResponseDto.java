package online.mavunohub.ecommerce.payment.Dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentResponseDto {

    private String reference;

    private String authorizationUrl;

    private String message;

    /**
     * {
     *     "orderId": 52,
     *     "reference": "ORD_20260626_ABC123",
     *     "accessCode": "ACCESS_xxxxx",
     *     "email": "customer@gmail.com",
     *     "amount": 650000
     * }
     */
}