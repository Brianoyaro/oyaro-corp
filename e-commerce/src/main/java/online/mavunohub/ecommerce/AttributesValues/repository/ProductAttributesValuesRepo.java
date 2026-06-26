package online.mavunohub.ecommerce.AttributesValues.repository;

import online.mavunohub.ecommerce.AttributeDefinitions.model.CategoryAttribute;
import online.mavunohub.ecommerce.AttributesValues.model.ProductAttributeValues;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductAttributesValuesRepo extends JpaRepository<ProductAttributeValues, Long> {
    void deleteAllByCategoryAttribute(CategoryAttribute attributeToRemove);
    long countByCategoryAttribute(CategoryAttribute categoryAttribute);
}
