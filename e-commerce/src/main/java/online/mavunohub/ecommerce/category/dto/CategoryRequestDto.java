package online.mavunohub.ecommerce.category.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequestDto {
    //
    private String categoryName;
    private String categoryDescription;
}
