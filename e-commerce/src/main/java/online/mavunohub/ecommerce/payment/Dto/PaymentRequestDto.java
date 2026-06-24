package online.mavunohub.ecommerce.payment.Dto;

import lombok.Data;
import online.mavunohub.ecommerce.payment.enums.PaymentMethod;


@Data
public class PaymentRequestDto {

    private Long orderId;

    private String email;

    private PaymentMethod paymentMethod;
}
