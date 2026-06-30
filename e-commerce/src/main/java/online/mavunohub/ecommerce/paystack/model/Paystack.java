package online.mavunohub.ecommerce.paystack.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import online.mavunohub.ecommerce.Order.model.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;


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
    private String reference; //paystack want a unique reference
    private String currency;
    private String accessCode;
    private String receiptNumber;
    private BigDecimal amount;
    private String customerPhone;
    private String email;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaystackStatus status = PaystackStatus.PENDING;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private LocalDateTime createdAt;
    private LocalDateTime verifiedAt;

    @PrePersist
    private void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
