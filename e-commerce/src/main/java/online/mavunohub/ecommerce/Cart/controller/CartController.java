package online.mavunohub.ecommerce.Cart.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.mavunohub.ecommerce.Authentication.model.User;
import online.mavunohub.ecommerce.Cart.Dto.AddToCartRequestDto;
import online.mavunohub.ecommerce.Cart.Dto.CartItemResponseDto;
import online.mavunohub.ecommerce.Cart.repository.CartItemRepo;
import online.mavunohub.ecommerce.Cart.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    private final CartItemRepo cartItemRepo;
    private final CartService cartService;

    /**
     * Get all cart items for authenticated user
     * GET /api/cart
     */
    @GetMapping
    public ResponseEntity<?> getCart(@AuthenticationPrincipal User user) {
        try {
            List<CartItemResponseDto> items = cartService.getCartItems(user);
            return ResponseEntity.status(HttpStatus.OK).body(items);
        } catch (RuntimeException e) {
            log.error("Error getting user's cart", e);
            Map<String, Object> response = new HashMap<>();
            response.put("Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            log.error("getCart Error: ", e);
            Map<String, Object> response = new HashMap<>();
            response.put("Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Remove item from cart
     * DELETE /api/cart/{productId}
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId) {
        try {
            cartService.removeFromCart(user, productId);
            Map<String, Object> response = new HashMap<>();
            response.put("Message", "Item removed from cart successfully");
            return ResponseEntity.ok().body(response);

        } catch (RuntimeException e) {
            log.error("Cart item not found");
            Map<String, Object> response = new HashMap<>();
            response.put("Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            log.error("Error removing item from cart", e);
            Map<String, Object> response = new HashMap<>();
            response.put("Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Clear entire cart
     * DELETE /api/cart/clear/all
     */
    @DeleteMapping("/clear/all")
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal User user) {
        try {
            cartService.clearCart(user.getId());
            Map<String, Object> response = new HashMap<>();
            response.put("Message", "Cart cleared successfully");
            return ResponseEntity.ok().body(response);

        } catch (RuntimeException e) {
            log.error("Cart not found for user with ID: {}", user.getId());
            Map<String, Object> response = new HashMap<>();
            response.put("Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            log.error("Error clearing cart", e);
            Map<String, Object> response = new HashMap<>();
            response.put("Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Add item to cart
     * POST /api/cart/add
     */
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @AuthenticationPrincipal User user,
            @RequestBody AddToCartRequestDto request) {
        try {
            if (request.getProductId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product ID is required");
            }
            if (request.getQuantity() == null || request.getQuantity() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantity must be greater than 0");
            }
            CartItemResponseDto cartItem = cartService.addItemToCart(user, request);
            return ResponseEntity.status(HttpStatus.OK).body(cartItem);

        } catch (RuntimeException e) {
            log.error(e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            log.error("Error adding item cart", e);
            Map<String, Object> response = new HashMap<>();
            response.put("Message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
