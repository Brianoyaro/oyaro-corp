package com.oyaro_corp.oyaro.corporation.order.repository;

import com.oyaro_corp.oyaro.corporation.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}