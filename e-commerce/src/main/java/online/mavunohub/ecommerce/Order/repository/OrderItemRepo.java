package online.mavunohub.ecommerce.Order.repository;

import online.mavunohub.ecommerce.Order.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {
}
