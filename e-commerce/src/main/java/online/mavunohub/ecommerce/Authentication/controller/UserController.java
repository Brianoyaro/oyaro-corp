package online.mavunohub.ecommerce.Authentication.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.mavunohub.ecommerce.Authentication.model.User;
import online.mavunohub.ecommerce.Authentication.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/user")
public class UserController {

    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;

@GetMapping("/profile")
public ResponseEntity<Map<String, Object>> profile( @AuthenticationPrincipal User user) {
    log.debug("user details : {}, email: {}", user, user.getEmail());
    Map<String, Object> profileData = new HashMap<>();
    profileData.put("id", user.getId());
    profileData.put("email", user.getEmail());
    profileData.put("role", user.getRole());
    profileData.put("last_login", user.getLastLogin());
    profileData.put("created_at", user.getCreatedAt());

    return ResponseEntity.ok(profileData);
}

    /**
     * Change password for authenticated user
     * PUT /api/user/profile/password
     */
    @PutMapping("/profile/password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @AuthenticationPrincipal User principal,
            @RequestBody Map<String, String> body) {

        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (currentPassword == null || currentPassword.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Current password is required"));
        }
        if (newPassword == null || newPassword.length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "New password must be at least 8 characters"));
        }
        if (!passwordEncoder.matches(currentPassword, principal.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Current password is incorrect"));
        }

        User user = userRepo.findById(principal.getId())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
