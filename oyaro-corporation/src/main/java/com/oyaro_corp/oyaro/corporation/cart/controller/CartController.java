package com.oyaro_corp.oyaro.corporation.cart.controller;
import com.oyaro_corp.oyaro.corporation.cart.dto.AddToCartRequest;
import com.oyaro_corp.oyaro.corporation.cart.dto.CartResponse;
import com.oyaro_corp.oyaro.corporation.cart.dto.UpdateCartItemRequest;
import com.oyaro_corp.oyaro.corporation.cart.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    // ✅ GET CART
    @GetMapping("/{userId}")
    public CartResponse getCart(@PathVariable Long userId) {
        return service.getCart(userId);
    }

    // ✅ ADD ITEM
    @PostMapping("/{userId}/items")
    public CartResponse addToCart(
            @PathVariable Long userId,
            @RequestBody AddToCartRequest req
    ) {
        return service.addToCart(userId, req);
    }

    // ✅ UPDATE ITEM
    @PutMapping("/items/{itemId}")
    public CartResponse updateItem(
            @PathVariable Long itemId,
            @RequestBody UpdateCartItemRequest req
    ) {
        return service.updateItem(itemId, req.getQuantity());
    }

    // ✅ REMOVE ITEM
    @DeleteMapping("/items/{itemId}")
    public CartResponse removeItem(@PathVariable Long itemId) {
        return service.removeItem(itemId);
    }

    // ✅ CLEAR CART
    @DeleteMapping("/{userId}")
    public void clearCart(@PathVariable Long userId) {
        service.clearCart(userId);
    }
}
