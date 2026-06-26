package online.mavunohub.ecommerce.paystack.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.mavunohub.ecommerce.Authentication.model.User;
import online.mavunohub.ecommerce.paystack.Dto.PaystackRequestDto;
import online.mavunohub.ecommerce.paystack.Dto.PaystackResponseDto;
import online.mavunohub.ecommerce.paystack.Dto.VerifyRequestDto;
import online.mavunohub.ecommerce.paystack.Dto.VerifyResponseDto;
import online.mavunohub.ecommerce.paystack.service.PaystackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/paystack")
public class PaystackController {
    private final PaystackService paystackService;

    @PostMapping("/initialize")
    public ResponseEntity<?> initializePaystack(
            @AuthenticationPrincipal User user,
            @RequestBody PaystackRequestDto paystackRequestDto
    ) {
        try {
//            String shippingAddress = paystackRequestDto.getShippingCounty() + paystackRequestDto.getShippingTown() + paystackRequestDto.getShippingStreet();
            String shippingAddress =
                    String.join(", ",
                            paystackRequestDto.getShippingStreet(),
                            paystackRequestDto.getShippingTown(),
                            paystackRequestDto.getShippingCounty());
            PaystackResponseDto response = paystackService.initializePaystack(user, shippingAddress);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/verify/{reference}")
    public ResponseEntity<?> verifyPaystack(@PathVariable String verifyRequest, @AuthenticationPrincipal User user) {
        try {
            VerifyRequestDto verifyRequestDto = VerifyRequestDto.builder()
                    .reference(verifyRequest)
                    .build();
            VerifyResponseDto response = paystackService.verifyPaystack(verifyRequestDto, user);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
