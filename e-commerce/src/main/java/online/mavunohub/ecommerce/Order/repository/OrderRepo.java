package online.mavunohub.ecommerce.Order.repository;

import online.mavunohub.ecommerce.Order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    //
}
