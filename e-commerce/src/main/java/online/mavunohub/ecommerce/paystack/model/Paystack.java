package online.mavunohub.ecommerce.paystack.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import online.mavunohub.ecommerce.Order.model.Order;

import java.math.BigDecimal;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Paystack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String reference;

    private BigDecimal amount;

    private String email;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaystackStatus status = PaystackStatus.PENDING;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
