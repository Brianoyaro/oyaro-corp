package online.mavunohub.ecommerce.AttributeDefinitions.model;

import online.mavunohub.ecommerce.AttributesValues.model.ProductAttributeValues;
import online.mavunohub.ecommerce.category.model.Category;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryAttribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // for safe deletion
    @OneToMany(
            mappedBy = "categoryAttribute",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<ProductAttributeValues> productAttributeValues = new ArrayList<>();
}
