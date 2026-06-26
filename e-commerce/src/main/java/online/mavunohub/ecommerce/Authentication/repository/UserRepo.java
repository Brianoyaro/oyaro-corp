package online.mavunohub.ecommerce.Authentication.repository;

import online.mavunohub.ecommerce.Authentication.model.Role;
import online.mavunohub.ecommerce.Authentication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    boolean existsByRole(Role role);
}