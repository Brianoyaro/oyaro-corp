package com.oyaro_corp.oyaro.corporation.cart.service;

import com.oyaro_corp.oyaro.corporation.Authentication.entity.User;
import com.oyaro_corp.oyaro.corporation.Authentication.repository.UserRepository;
import com.oyaro_corp.oyaro.corporation.cart.dto.AddToCartRequest;
import com.oyaro_corp.oyaro.corporation.cart.dto.CartItemResponse;
import com.oyaro_corp.oyaro.corporation.cart.dto.CartResponse;
import com.oyaro_corp.oyaro.corporation.cart.entity.Cart;
import com.oyaro_corp.oyaro.corporation.cart.entity.CartItem;
import com.oyaro_corp.oyaro.corporation.cart.repository.CartItemRepository;
import com.oyaro_corp.oyaro.corporation.cart.repository.CartRepository;
import com.oyaro_corp.oyaro.corporation.product.entity.Product;
import com.oyaro_corp.oyaro.corporation.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepo;
    private final CartItemRepository itemRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    public CartService(CartRepository cartRepo,
                       CartItemRepository itemRepo,
                       ProductRepository productRepo,
                       UserRepository userRepo) {
        this.cartRepo = cartRepo;
        this.itemRepo = itemRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    // ✅ CREATE CART WHEN USER IS CREATED
    public Cart createCartForUser(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepo.save(cart);
    }

    // ✅ GET CART
    public CartResponse getCart(Long userId) {
        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return mapToResponse(cart);
    }

    // ✅ ADD TO CART
    public CartResponse addToCart(Long userId, AddToCartRequest req) {

        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow();

        Product product = productRepo.findById(req.getProductId())
                .orElseThrow();

        Optional<CartItem> existing =
                itemRepo.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + req.getQuantity());
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(req.getQuantity());
            cart.getItems().add(item);
        }

        cartRepo.save(cart);

        return mapToResponse(cart);
    }

    // ✅ UPDATE ITEM
    public CartResponse updateItem(Long itemId, Integer quantity) {
        CartItem item = itemRepo.findById(itemId).orElseThrow();

        item.setQuantity(quantity);

        return mapToResponse(item.getCart());
    }

    // ✅ REMOVE ITEM
    public CartResponse removeItem(Long itemId) {
        CartItem item = itemRepo.findById(itemId).orElseThrow();

        Cart cart = item.getCart();
        cart.getItems().remove(item);

        return mapToResponse(cart);
    }

    // ✅ CLEAR CART
    public void clearCart(Long userId) {
        Cart cart = cartRepo.findByUserId(userId).orElseThrow();
        cart.getItems().clear();
    }

    // 🔁 MAPPER
    private CartResponse mapToResponse(Cart cart) {
        CartResponse res = new CartResponse();
        res.setCartId(cart.getId());
        res.setUserId(cart.getUser().getId());

        res.setItems(cart.getItems().stream().map(item -> {
            CartItemResponse ir = new CartItemResponse();
            ir.setId(item.getId());
            ir.setProductId(item.getProduct().getId());
            ir.setProductName(item.getProduct().getName());
            ir.setPrice(item.getProduct().getPrice());
            ir.setQuantity(item.getQuantity());
            return ir;
        }).toList());

        res.setTotalPrice(cart.getItems().stream()
                .mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity())
                .sum());

        return res;
    }
}