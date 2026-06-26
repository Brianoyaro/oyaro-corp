package online.mavunohub.ecommerce.Order.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.mavunohub.ecommerce.Authentication.model.User;
import online.mavunohub.ecommerce.Order.Dto.CreateOrderRequest;
import online.mavunohub.ecommerce.Order.Dto.OrderResponseDto;
import online.mavunohub.ecommerce.Order.model.OrderStatus;
import online.mavunohub.ecommerce.Order.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
    private final OrderService orderService;

    /**
     * Create order from authenticated user's cart
     * POST /api/orders/from-cart
     * Authentication: REQUIRED
     */
    @PostMapping("/create")
    public ResponseEntity<?> createOrderFromCart(
            @AuthenticationPrincipal User user,
            @RequestBody CreateOrderRequest request) {
        try {
            if (request.getShippingAddress() == null || request.getShippingAddress().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("Message", "Shipping address is required"));
            }

            OrderResponseDto order = orderService.createOrderFromCart(
                    user,
                    request.getShippingAddress()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(order);

        } catch (RuntimeException e) {
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("Message", "Internal Server Error: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating order from cart", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("Message", "Failed to create order: " + e.getMessage()));
        }
    }

    /**
     * Get authenticated user's orders
     * GET /api/orders/user/all
     * Authentication: REQUIRED
     */
    @GetMapping("/user/all")
    public ResponseEntity<?> getUserOrders(@AuthenticationPrincipal User user) {
        try {
            List<OrderResponseDto> orders = orderService.getUserOrders(user);
            return ResponseEntity.status(HttpStatus.OK).body(orders);
        } catch (Exception e) {
            log.error("Error retrieving user orders", e);
            Map<String, Object> response = new HashMap<>();
            response.put("Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get order by ID (authenticated user can only see their own orders)
     * GET /api/orders/user/{orderId}
     * Authentication: REQUIRED
     */
    @GetMapping("/user/{orderId}")
    public ResponseEntity<?> getOrderById(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId) {
        try {
            OrderResponseDto order = orderService.getOrder(orderId);

            // Verify order belongs to authenticated user
            if (!order.getEmail().equals(user.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("Message", "You don not have permission to view this order"));
            }
            return ResponseEntity.status(HttpStatus.OK).body(order);
        } catch (RuntimeException e) {
            log.error("Error retrieving order", e);
            Map<String, Object> response = new HashMap<>();
            response.put("Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            log.error("Internal Server Error encountered while retrieving order", e);
            Map<String, Object> response = new HashMap<>();
            response.put("Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    //

    /**
     * Update order status (admin only)
     * PUT /api/orders/{orderId}/status/{status}
     * Authentication: REQUIRED (Admin role)
     */
    @PutMapping("/{orderId}/status/{status}")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @PathVariable String status) {
        try {
            // Validate status
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());

            OrderResponseDto updatedOrder = orderService.updateOrderStatus(orderId, orderStatus);
            return ResponseEntity.status(HttpStatus.OK).body(updatedOrder);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("Message", "Invalid order status: " + status));
        } catch (Exception e) {
            log.error("Error updating order status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("Message", "Failed to update order status: " + e.getMessage()));
        }
    }

    /**
     * Cancel order
     * PUT /api/orders/{orderId}/cancel
     * Authentication: REQUIRED
     */
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId) {
        try {
            OrderResponseDto order = orderService.getOrder(orderId);

            // Verify order belongs to authenticated user
            if (!order.getEmail().equals(user.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("Message", "You do not have permission to cancel this order"));
            }

            OrderResponseDto cancelledOrder = orderService.cancelOrder(orderId);
            return ResponseEntity.status(HttpStatus.OK).body(cancelledOrder);

        } catch (RuntimeException e) {
            log.error("Error encountered when cancelling order", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("Message", "Failed to cancel order: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Error cancelling order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("Message", "Failed to cancel order: " + e.getMessage()));
        }
    }

    /**
     * Delete order (admin only)
     * DELETE /api/orders/{orderId}
     * Authentication: REQUIRED (Admin role)
     */
    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("Message", "Order deleted successfully"));

        } catch (RuntimeException e) {
            log.error("Error deleting order", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("Message", "Failed to delete order: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Error deleting order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("Message", "Internal Server Error: " + e.getMessage()));
        }
    }

    /**
     * Get all orders (admin only)
     * GET /api/orders/admin/all
     * Authentication: REQUIRED (Admin role)
     */
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<OrderResponseDto> orders = orderService.getAllOrders();
            return ResponseEntity.status(HttpStatus.OK).body(orders);

        } catch (Exception e) {
            log.error("Error retrieving all orders", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("Message", "Failed to retrieve orders: " + e.getMessage()));
        }
    }

}