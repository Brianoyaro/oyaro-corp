package online.mavunohub.ecommerce.payment.service.impl;

import lombok.RequiredArgsConstructor;
import online.mavunohub.ecommerce.Order.model.Order;
import online.mavunohub.ecommerce.Order.repository.OrderRepo;
import online.mavunohub.ecommerce.payment.Dto.PaymentRequestDto;
import online.mavunohub.ecommerce.payment.Dto.PaymentResponseDto;
import online.mavunohub.ecommerce.payment.enums.PaymentStatus;
import online.mavunohub.ecommerce.payment.model.Payment;
import online.mavunohub.ecommerce.payment.repository.PaymentRepository;
import online.mavunohub.ecommerce.payment.service.PaymentService;
import online.mavunohub.ecommerce.payment.service.PaystackService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaystackService paystackService;
    private final OrderRepo orderRepo;

    @Override
    public PaymentResponseDto initiatePayment(PaymentRequestDto request) {

        Order order = orderRepo.findById(request.getOrderId())
                .orElseThrow();

        String reference = UUID.randomUUID().toString();

        Payment payment = Payment.builder()
                .reference(reference)
                .orderId(order.getId())
                .email(request.getEmail())
                .amount(order.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .build();

        paymentRepository.save(payment);

        String url = paystackService.initializeTransaction(
                request.getEmail(),
                order.getTotalAmount(),   // ✅ SOURCE OF TRUTH
                reference
        );
        return PaymentResponseDto.builder()
                .reference(reference)
                .authorizationUrl(url)
                .message("Redirect to Paystack to complete payment")
                .build();
    }
}