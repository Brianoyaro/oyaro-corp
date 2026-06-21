package online.mavunohub.ecommerce.ProductImages.respository;

import online.mavunohub.ecommerce.ProductImages.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImagesRepo extends JpaRepository<ProductImage, Long> {
}
