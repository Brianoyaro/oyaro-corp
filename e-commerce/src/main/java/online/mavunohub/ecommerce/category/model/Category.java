package online.mavunohub.ecommerce.category.model;

import online.mavunohub.ecommerce.AttributeDefinitions.model.CategoryAttribute;
import online.mavunohub.ecommerce.Product.model.Product;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // list of attributeDefinitions
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CategoryAttribute> attributes =  new ArrayList<>();

    // list of products
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    List<Product> products = new ArrayList<>();

    public Category appendProductToProductList(Product product) {
        this.getProducts().add(product);
        return this;
    }

    /*
    // helper methods
    // addproduct is preferd over appendProductToProductLis
    public void addProduct(Product product) {
        products.add(product);
        product.setCategory(this);
    }

    public void removeProduct(Product product) {
        products.remove(product);
        product.setCategory(null);
    }*/
}
