package com.oyaro_corp.oyaro.corporation.cart.controller;
import com.oyaro_corp.oyaro.corporation.cart.dto.AddToCartRequest;
import com.oyaro_corp.oyaro.corporation.cart.dto.CartResponse;
import com.oyaro_corp.oyaro.corporation.cart.dto.UpdateCartItemRequest;
import com.oyaro_corp.oyaro.corporation.cart.service.CartService;
import com.oyaro_corp.oyaro.corporation.wrapper.IDORprevention;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    // ✅ GET CART
    @GetMapping("/{userId}")
    public CartResponse getCart(@PathVariable Long userId) throws AccessDeniedException {
//        IDORprevention.isThisMyId(userId);
        return service.getCart(userId);
    }

    // ✅ ADD ITEM
    @PostMapping("/{userId}/items")
    public CartResponse addToCart(
            @PathVariable Long userId,
            @RequestBody AddToCartRequest req
    ) throws AccessDeniedException {
//        IDORprevention.isThisMyId(userId);
        return service.addToCart(userId, req);
    }

    // ✅ UPDATE ITEM
    @PutMapping("/items/{itemId}")
    public CartResponse updateItem(
            @PathVariable Long itemId,
            @RequestBody UpdateCartItemRequest req
    ) throws AccessDeniedException {
        return service.updateItem(itemId, req.getQuantity());
    }

    // ✅ REMOVE ITEM
    @DeleteMapping("/items/{itemId}")
    public CartResponse removeItem(@PathVariable Long itemId) throws AccessDeniedException {
        return service.removeItem(itemId);
    }

    // ✅ CLEAR CART
    @DeleteMapping("/{userId}")
    public void clearCart(@PathVariable Long userId) throws AccessDeniedException {
//        IDORprevention.isThisMyId(userId);
        service.clearCart(userId);
    }
}
