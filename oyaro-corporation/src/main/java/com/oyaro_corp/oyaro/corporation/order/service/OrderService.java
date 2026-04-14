package com.oyaro_corp.oyaro.corporation.order.service;


import com.oyaro_corp.oyaro.corporation.Authentication.entity.User;
import com.oyaro_corp.oyaro.corporation.order.dto.CreateOrderRequest;
import com.oyaro_corp.oyaro.corporation.order.dto.OrderItemRequest;
import com.oyaro_corp.oyaro.corporation.order.dto.OrderItemResponse;
import com.oyaro_corp.oyaro.corporation.order.dto.OrderResponse;
import com.oyaro_corp.oyaro.corporation.order.entity.Order;
import com.oyaro_corp.oyaro.corporation.order.entity.OrderItem;
import com.oyaro_corp.oyaro.corporation.order.repository.OrderRepository;
import com.oyaro_corp.oyaro.corporation.product.entity.Product;
import com.oyaro_corp.oyaro.corporation.product.repository.ProductRepository;
import com.oyaro_corp.oyaro.corporation.wrapper.IDORprevention;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {

        Order order = new Order();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        User user = (User)authentication.getPrincipal();
        assert  user != null;

        order.setUser(user);

        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (OrderItemRequest itemReq : request.getItems()) {

            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setProductId(product.getId());
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getPrice()); // snapshot

            item.setOrder(order);

            total += product.getPrice() * itemReq.getQuantity();

            items.add(item);
        }

        order.setItems(items);
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getUserOrders() {
        // this is already IDOR secure because we're extracting userId from the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        User user = (User)authentication.getPrincipal();
        assert user != null;
        return orderRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        // prevent IDOR attack
        IDORprevention.isThisMyOrder(order);

        return mapToResponse(order);
    }

    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order NOT found."));
        // Prevent IDOR attacks
        IDORprevention.isThisMyOrder(order);

        orderRepository.deleteById(id);
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setTotalAmount(order.getTotalAmount());
        res.setStatus(order.getStatus().name());

        List<OrderItemResponse> itemResponses = order.getItems().stream().map(item -> {
            OrderItemResponse i = new OrderItemResponse();
            i.setProductId(item.getProductId());
            i.setQuantity(item.getQuantity());
            i.setPrice(item.getPrice());
            return i;
        }).toList();

        res.setItems(itemResponses);

        return res;
    }
}