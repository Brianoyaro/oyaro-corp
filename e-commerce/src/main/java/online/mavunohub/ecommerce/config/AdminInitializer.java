package online.mavunohub.ecommerce.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.mavunohub.ecommerce.Authentication.model.Role;
import online.mavunohub.ecommerce.Authentication.model.User;
import online.mavunohub.ecommerce.Authentication.repository.UserRepo;
import online.mavunohub.ecommerce.Cart.model.Cart;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner createAdmin() {
        return args -> {

            String adminEmail = "admin@gmail.com";
            String adminPassword = "password";

            boolean adminExists = userRepo.existsByEmail(adminEmail) && userRepo.existsByRole(Role.ADMIN);

            if (!adminExists) {
                Cart cart = new Cart();
                User admin = User.builder()
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .role(Role.ADMIN)
                        .cart(cart)
                        .lastLogin(LocalDateTime.now())
                        .build();

                userRepo.save(admin);

                log.info("✅ Admin user created at startup");
            } else {
                log.info("ℹ️ Admin already exists");
            }
        };
    }
}
