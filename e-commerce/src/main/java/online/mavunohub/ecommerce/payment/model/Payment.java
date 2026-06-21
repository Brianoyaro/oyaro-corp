package online.mavunohub.ecommerce.payment.model;

import jakarta.persistence.*;
import lombok.*;
import online.mavunohub.ecommerce.Order.model.Order;
import online.mavunohub.ecommerce.payment.enums.PaymentMethod;
import online.mavunohub.ecommerce.payment.enums.PaymentStatus;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String reference;

    private BigDecimal amount;

    private String email;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(nullable = false)
    private Long orderId;
}