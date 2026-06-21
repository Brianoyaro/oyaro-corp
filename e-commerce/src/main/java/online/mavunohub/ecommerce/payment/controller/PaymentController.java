package online.mavunohub.ecommerce.payment.controller;

import lombok.RequiredArgsConstructor;
import online.mavunohub.ecommerce.Cart.service.CartService;
import online.mavunohub.ecommerce.Order.model.Order;
import online.mavunohub.ecommerce.Order.model.OrderStatus;
import online.mavunohub.ecommerce.Order.repository.OrderRepo;
import online.mavunohub.ecommerce.payment.Dto.PaymentRequestDto;
import online.mavunohub.ecommerce.payment.Dto.PaymentResponseDto;
import online.mavunohub.ecommerce.payment.enums.PaymentStatus;
import online.mavunohub.ecommerce.payment.repository.PaymentRepository;
import online.mavunohub.ecommerce.payment.service.PaymentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final OrderRepo orderRepo;
    private final CartService cartService;

    @PostMapping
    public PaymentResponseDto pay(@RequestBody PaymentRequestDto request) {
        return paymentService.initiatePayment(request);
    }

    @PostMapping("/webhook/paystack")
    public void handleWebhook(@RequestBody Map<String, Object> payload) {

        Map data = (Map) payload.get("data");
        String reference = (String) data.get("reference");

        paymentRepository.findByReference(reference).ifPresent(payment -> {
            payment.setStatus(PaymentStatus.SUCCESS);
            paymentRepository.save(payment);

            // TODO:
            // - update order status to CONFIRMED
            Long orderId = payment.getOrderId();
            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            order.setOrderStatus(OrderStatus.CONFIRMED);
            orderRepo.save(order);

            // - clear cart
            Long userId = order.getUser().getId();
            cartService.clearCart(userId);
        });
    }
}