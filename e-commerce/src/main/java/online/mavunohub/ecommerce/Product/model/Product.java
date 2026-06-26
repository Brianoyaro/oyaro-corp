package online.mavunohub.ecommerce.Product.model;

import online.mavunohub.ecommerce.AttributesValues.model.ProductAttributeValues;
import online.mavunohub.ecommerce.Cart.model.CartItem;
import online.mavunohub.ecommerce.Order.model.OrderItem;
import online.mavunohub.ecommerce.ProductImages.model.ProductImage;
import online.mavunohub.ecommerce.category.model.Category;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;

    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    //list of product images
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    List<ProductImage> productImages = new ArrayList<>();


    //list of product-attributes
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<ProductAttributeValues> attributes =  new ArrayList<>();
}
