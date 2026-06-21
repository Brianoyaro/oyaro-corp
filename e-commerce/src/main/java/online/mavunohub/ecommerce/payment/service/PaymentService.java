package online.mavunohub.ecommerce.payment.service;

import online.mavunohub.ecommerce.payment.Dto.PaymentRequestDto;
import online.mavunohub.ecommerce.payment.Dto.PaymentResponseDto;

public interface PaymentService {
    PaymentResponseDto initiatePayment(PaymentRequestDto request);
}
