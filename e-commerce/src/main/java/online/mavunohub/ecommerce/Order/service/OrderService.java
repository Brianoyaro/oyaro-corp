package online.mavunohub.ecommerce.Order.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.mavunohub.ecommerce.Authentication.model.User;
import online.mavunohub.ecommerce.Cart.model.Cart;
import online.mavunohub.ecommerce.Cart.model.CartItem;
import online.mavunohub.ecommerce.Order.Dto.OrderItemDto;
import online.mavunohub.ecommerce.Order.Dto.OrderResponseDto;
import online.mavunohub.ecommerce.Order.model.Order;
import online.mavunohub.ecommerce.Order.model.OrderItem;
import online.mavunohub.ecommerce.Order.model.OrderStatus;
import online.mavunohub.ecommerce.Order.repository.OrderRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderService {

    private final OrderRepo orderRepo;

    /**
     * Create order from authenticated user's cart items
     */
    public OrderResponseDto createOrderFromCart(User user, String shippingAddress) {
        log.info("Creating order from cart for user: {}", user.getId());
        Cart cart = user.getCart();
        List<CartItem> cartItems = cart.getItems();

        if (cartItems.isEmpty()) {
            log.error("Can not create an order from an empty cart");
            throw new RuntimeException("Can not create an order from an empty cart");
        }

        // Calculate total amount
        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // create  order
        Order order = Order.builder()
                .user(user)
                .shippingAddress(shippingAddress)
                .totalAmount(totalAmount)
                .build();

        // create orderItems
        for (CartItem item : cartItems) {
            BigDecimal subtotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .unitPrice(item.getProduct().getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .build();
            order.getOrderItems().add(orderItem);
        };

        order =  orderRepo.save(order);

        // call mapper
        return mapper(order);
    }

    /**
     * Get one order by ID
     */
    public OrderResponseDto getOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return mapper(order);
    }

    /**
     * Get all orders for authenticated user
     */
    public List<OrderResponseDto> getUserOrders(User user) {
        return orderRepo.findByUserId(user.getId())
                .stream()
                .map(this::mapper)
                .collect(Collectors.toList());
    }

    /**
     * Get all orders - admin
     */
    public List<OrderResponseDto> getAllOrders() {
        return orderRepo.findAll()
                .stream()
                .map(this::mapper)
                .collect(Collectors.toList());
    }

    /**
     * Delete an Order
     */
    public void deleteOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order with ID: " + orderId + " not found"));
        orderRepo.delete(order);
    }

    /**
     * Update order status
     */
    public OrderResponseDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setOrderStatus(newStatus);
        if (newStatus == OrderStatus.CONFIRMED) {
            order.setCompletedAt(LocalDateTime.now());
        }

        Order updatedOrder = orderRepo.save(order);
        log.info("Order {} status updated to {}", orderId, newStatus);

        return mapper(updatedOrder);
    }

    /**
     * Cancel order
     */
    public OrderResponseDto cancelOrder(Long orderId) {
        return updateOrderStatus(orderId, OrderStatus.CANCELLED);
    }

    private OrderResponseDto mapper(Order order) {

        List<OrderItem> orderItems = order.getOrderItems();
        List<OrderItemDto> orderItemDtos = new ArrayList<>();

        orderItems.forEach(orderItem -> {
            OrderItemDto orderItemDto = OrderItemDto.builder()
                    .id(orderItem.getId())
                    .quantity(orderItem.getQuantity())
                    .unitPrice(orderItem.getUnitPrice())
                    .subtotal(orderItem.getSubtotal())
                    .productId(orderItem.getProductId())
                    .productName(orderItem.getProductName())
                    .build();
            orderItemDtos.add(orderItemDto);
        });

        return OrderResponseDto.builder()
                .id(order.getId())
                .email(order.getUser().getEmail())
                .totalAmount(order.getTotalAmount())
                .orderItems(orderItemDtos)
                .orderStatus(String.valueOf(order.getOrderStatus()))
                .shippingAddress(order.getShippingAddress())
                .createdAt(String.valueOf(order.getCreatedAt()))
                .completedAt(order.getCompletedAt() != null ? String.valueOf(order.getCompletedAt()) : null)
                .build();
    };
}
