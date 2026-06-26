package online.mavunohub.ecommerce.AttributeDefinitions.repository;

import online.mavunohub.ecommerce.AttributeDefinitions.model.CategoryAttribute;
import online.mavunohub.ecommerce.category.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryAttributeDefinitionsRepo extends JpaRepository<CategoryAttribute, Long> {
    Boolean existsByName(String name);
    List<CategoryAttribute> findByName(String name);
    List<CategoryAttribute> findByCategory(Category category);
}
