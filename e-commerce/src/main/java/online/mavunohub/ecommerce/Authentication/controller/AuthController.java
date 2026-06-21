package online.mavunohub.ecommerce.Authentication.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.mavunohub.ecommerce.Authentication.Dto.AuthRequestDto;
import online.mavunohub.ecommerce.Authentication.Dto.AuthResponseDto;
import online.mavunohub.ecommerce.Authentication.Dto.RefreshTokenRequestDto;
import online.mavunohub.ecommerce.Authentication.Dto.RegisterRequestDto;
import online.mavunohub.ecommerce.Authentication.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequestDto registerRequest) {
        //
        try {
            AuthResponseDto authResponse = authService.register(registerRequest);
            return ResponseEntity.ok(authResponse);
            // email already exists error captured here.
        } catch (IllegalStateException e) {
            log.error("IllegalStateException Error encountered during user registration: {}.", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
            // general errors captured here.
        } catch (Exception e) {
            log.error("Error encountered during user registration: {}.", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDto authRequest) {
        //
        try {
            AuthResponseDto authResponse = authService.authenticate(authRequest);
            return ResponseEntity.ok(authResponse);
        } catch (UsernameNotFoundException e) {
            log.error("Username not found exception during Login: {}.", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(response);
        }catch (Exception e) {
            log.error("Error encountered during user authentication: {}.", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Authentication service is running");
    }

    // refresh tokens
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequestDto refreshTokenRequest) {
        try {
            AuthResponseDto authResponse = authService.refreshToken(refreshTokenRequest);
            return ResponseEntity.ok(authResponse);
        } catch (UsernameNotFoundException e) {
            log.error("Username not found exception during token refresh");
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(response);
        }catch (Exception e) {
            log.error("Error encountered during Token refresh: {}.", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }
}
