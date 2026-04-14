package com.oyaro_corp.oyaro.corporation.order.controller;

import com.oyaro_corp.oyaro.corporation.order.dto.CreateOrderRequest;
import com.oyaro_corp.oyaro.corporation.order.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(
                orderService.createOrder(request)
        );
    }

    @GetMapping
    public ResponseEntity<?> getUserOrders() {
        return ResponseEntity.ok(
                orderService.getUserOrders()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(
                orderService.getOrderById(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Deleted");
    }
}