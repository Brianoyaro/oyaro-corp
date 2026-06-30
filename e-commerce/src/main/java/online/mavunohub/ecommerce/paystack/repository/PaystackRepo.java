package online.mavunohub.ecommerce.paystack.repository;

import online.mavunohub.ecommerce.paystack.model.Paystack;
import online.mavunohub.ecommerce.paystack.model.PaystackStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PaystackRepo extends JpaRepository<Paystack, Long> {
    Optional<Paystack> findByReference(String reference);

    Optional<Paystack> findFirstByEmailAndStatusAndCreatedAtAfterOrderByCreatedAtDesc(
            String email,
            PaystackStatus status,
            LocalDateTime cutoff
    );
}
