package online.mavunohub.ecommerce.Product.repository;

import online.mavunohub.ecommerce.Product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<Product, Long> {
}
