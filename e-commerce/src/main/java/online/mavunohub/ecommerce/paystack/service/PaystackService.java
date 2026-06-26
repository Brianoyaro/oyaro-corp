package online.mavunohub.ecommerce.paystack.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.mavunohub.ecommerce.Authentication.model.User;
import online.mavunohub.ecommerce.Order.Dto.OrderResponseDto;
import online.mavunohub.ecommerce.Order.model.Order;
import online.mavunohub.ecommerce.Order.model.OrderStatus;
import online.mavunohub.ecommerce.Order.repository.OrderRepo;
import online.mavunohub.ecommerce.Order.service.OrderService;
import online.mavunohub.ecommerce.paystack.Dto.PaystackResponseDto;
import online.mavunohub.ecommerce.paystack.Dto.VerifyRequestDto;
import online.mavunohub.ecommerce.paystack.Dto.VerifyResponseDto;
import online.mavunohub.ecommerce.paystack.model.Paystack;
import online.mavunohub.ecommerce.paystack.model.PaystackStatus;
import online.mavunohub.ecommerce.paystack.repository.PaystackRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PaystackService {
    private final PaystackRepo paystackRepo;
    private final OrderService orderService;
    private final OrderRepo orderRepo;
    private final WebClient webClient;
    @Value("${paystack.secret}")
    private String secret;
    @Value("${paystack.base-url}")
    private String baseUrl;

    // initialize
    /**
     * curl https://api.paystack.co/transaction/initialize
     * -H "Authorization: Bearer YOUR_SECRET_KEY"
     * -H "Content-Type: application/json"
     * -d '{ "email": "customer@email.com",
     *       "amount": "500000"
     *     }'
     * -X POST
     */
    public PaystackResponseDto initializePaystack(User user, String shippingAddress) {
        // create an order
        OrderResponseDto orderRsponse = orderService.createOrderFromCart(user, shippingAddress);
        Long orderId = orderRsponse.getId();
        Order order = orderRepo.findById(orderId).orElseThrow();

        // create a reference
        String reference = UUID.randomUUID().toString();

        // crate a pending payment
        BigDecimal amount = order.getTotalAmount();

        Paystack paystack = Paystack.builder()
                .reference(reference)
                .order(order)
                .amount(amount)
                .email(user.getEmail())
                .build();
        paystackRepo.save(paystack);

        /**
         * call /transactions/initialize endpoint
         */
        Map<String, Object> payload = new HashMap<>();
        payload.put("email", user.getEmail());
        // Paystack uses smallest currency unit
        payload.put(
                "amount",
                amount.multiply(BigDecimal.valueOf(100)).intValue()
        );
        payload.put("currency", "KES");
        payload.put("reference", reference);
        //payload.put("callback_url", "http://localhost:3000/payment/success");
        Map response =
                webClient.post()
                        .uri(baseUrl + "/transaction/initialize")
                        .header("Authorization", "Bearer " + secret)
                        .bodyValue(payload)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

        Map data = (Map) response.get("data");
        String authorizationUrl = data.get("authorization_url").toString();
        String accessCode = data.get("access_code").toString();
        String referenceCode = data.get("reference").toString();


        return PaystackResponseDto.builder()
                .accessCode(accessCode)
                .reference(referenceCode)
                .authorizationUrl(authorizationUrl)
                .orderId(orderId)
                .build();
    }

    // verify
    /**
     * curl https://api.paystack.co/transaction/verify/:reference
     * -H "Authorization: Bearer YOUR_SECRET_KEY"
     * -X GET
     *
     * @return
     */
    public VerifyResponseDto verifyPaystack(VerifyRequestDto request, User user) {
        //
        String reference = request.getReference();
        Map response =
                webClient.get()
                        .uri(baseUrl + "/transaction/verify/{reference}", reference)
                        .header("Authorization", "Bearer " + secret)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();
        Map data = (Map) response.get("data");
        String status = (String) data.get("status");
        String receiptNumber = (String) data.get("receipt_number");
        String referenceCode = (String) data.get("reference");
        Number amount = (Number) data.get("amount");
        BigDecimal actualAmount =
                BigDecimal.valueOf(amount.longValue())
                        .divide(BigDecimal.valueOf(100));

        Paystack payment = paystackRepo.findByReference(reference).orElseThrow();

        if (!payment.getEmail().equals(user.getEmail())) {
            throw new RuntimeException("Unauthorized");
        }

        BigDecimal expected = payment.getAmount();
        if (expected.compareTo(actualAmount) != 0) {
            throw new RuntimeException("Payment amount mismatch.");
        }

        if (status.equalsIgnoreCase("success")) {
            payment.setStatus(PaystackStatus.SUCCESS);
            // change order status
            payment.getOrder().setOrderStatus(OrderStatus.CONFIRMED);
        }
        paystackRepo.save(payment);


        return VerifyResponseDto.builder()
                .reference(referenceCode)
                .receiptNumber(receiptNumber)
                .status(status)
                .amount(actualAmount)
                .build();
    }
}
