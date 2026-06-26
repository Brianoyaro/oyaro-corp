package online.mavunohub.ecommerce.paystack.Dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaystackRequestDto {
    private String contactName;
    private String contactPhone;
    private String shippingStreet;
    private String shippingCounty;
    private String shippingTown;
}
