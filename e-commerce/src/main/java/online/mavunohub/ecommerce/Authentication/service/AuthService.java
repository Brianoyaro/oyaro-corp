package online.mavunohub.ecommerce.Authentication.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.mavunohub.ecommerce.Authentication.Dto.AuthRequestDto;
import online.mavunohub.ecommerce.Authentication.Dto.AuthResponseDto;
import online.mavunohub.ecommerce.Authentication.Dto.RefreshTokenRequestDto;
import online.mavunohub.ecommerce.Authentication.Dto.RegisterRequestDto;
import online.mavunohub.ecommerce.Authentication.model.Role;
import online.mavunohub.ecommerce.Authentication.model.User;
import online.mavunohub.ecommerce.Authentication.repository.UserRepo;
import online.mavunohub.ecommerce.Cart.service.CartService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepo userRepo;
    private final CartService cartService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDto register(@RequestBody RegisterRequestDto registerRequest) {
        // check if user exists
        if (userRepo.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .lastLogin(LocalDateTime.now())
                .build();


        user = userRepo.save(user);

        // create cart for each user when they're created
        if (user.getRole() != Role.ADMIN) {
            cartService.createCartForUser(user);
//            user.setCart(cart);
        }

        return mapper(user);
    }

    private AuthResponseDto mapper(User user) {
        // generate access and refresh access tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtService.getAccessTokenExpiration())
                .build();
    }

    public AuthResponseDto authenticate(@RequestBody AuthRequestDto authRequest) {
        // authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        // load the user
        User user = userRepo.findByEmail(authRequest.getEmail()).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // add metadata
        user.setLastLogin(LocalDateTime.now());

        userRepo.save(user);

        return mapper(user);
    }

    // refresh access token
    public AuthResponseDto refreshToken(RefreshTokenRequestDto refreshTokenRequest) {
        final String refreshToken = refreshTokenRequest.getRefreshToken();
        final String userEmail;

        try {
            // extract username from refreshToken
            userEmail = jwtService.extractUsername(refreshToken);
            if (userEmail != null) {
                // load user details from the database
                User user = userRepo.findByEmail(userEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                // validate the refresh token
                if (jwtService.isTokenValid(refreshToken, user)) {
                    // validate issuer and audience
                    if (jwtService.validateAudience(refreshToken) && jwtService.validateIssuer(refreshToken)) {
                        return mapper(user);
                    }
                }
            }
        } catch (Exception e) {
            throw new IllegalStateException("Invalid refresh token");
        }
        throw new IllegalStateException("Invalid refresh token");
    }
}
