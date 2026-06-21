package online.mavunohub.ecommerce.Cart.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import online.mavunohub.ecommerce.Authentication.model.User;
import online.mavunohub.ecommerce.Cart.Dto.AddToCartRequestDto;
import online.mavunohub.ecommerce.Cart.Dto.CartItemResponseDto;
import online.mavunohub.ecommerce.Cart.model.Cart;
import online.mavunohub.ecommerce.Cart.model.CartItem;
import online.mavunohub.ecommerce.Cart.repository.CartItemRepo;
import online.mavunohub.ecommerce.Cart.repository.CartRepo;
import online.mavunohub.ecommerce.Product.model.Product;
import online.mavunohub.ecommerce.Product.repository.ProductRepo;
import online.mavunohub.ecommerce.ProductImages.model.ProductImage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class CartService {

    private final CartRepo cartRepo;
    private final CartItemRepo cartItemRepo;
    private final ProductRepo productRepo;

    public CartItemResponseDto addItemToCart(User user, AddToCartRequestDto request) {
        log.info("Adding product {} to cart for user {}", request.getProductId(), user.getId());
        Cart cart = user.getCart();
        if (cart == null) {
            throw new RuntimeException("User cart is null for  user " + user.getId());
        }
        List<CartItem> cartItems = cartItemRepo.findByCartId(cart.getId());
        CartItem existingCartItem = null;
        for (CartItem cartItem : cartItems) {
            if (cartItem.getProduct().getId().equals(request.getProductId())) {
                existingCartItem = cartItem;
            }
        };
        CartItem cartItem;
        if (existingCartItem != null) {
            // cartItem exists, update the quantity
            cartItem = existingCartItem;
            cartItem.setQuantity(request.getQuantity());
            log.info("Updated quantity for product {} in cart", request.getProductId());
        } else {
            // create a new cartItem
            Product product = productRepo.findById(request.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product with id " + request.getProductId() + " not found"));
            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();

            log.info("Added new product {} to cart", request.getProductId());
        }
        cartItem = cartItemRepo.save(cartItem);
        return mapper(cartItem);
    }

    private CartItemResponseDto mapper(CartItem cartItem) {
        Product product = productRepo.findById(cartItem.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product with ID " + cartItem.getProduct().getId() + " not found"));


        List<ProductImage> productImageList = product.getProductImages();
        AtomicReference<String> imgUrl = new AtomicReference<>(productImageList.getFirst().getImgUrl());
        productImageList.forEach(imageItem -> {
            if (imageItem.getIsPrimary()) {
                imgUrl.set(imageItem.getImgUrl());
            }
        });

        BigDecimal subTotal = cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        return CartItemResponseDto.builder()
                .id(cartItem.getId())
                .productId(cartItem.getProduct().getId())
                .quantity(cartItem.getQuantity())
                .productName(cartItem.getProduct().getName())
                .unitPrice(cartItem.getProduct().getPrice())
                .productCategoryName(cartItem.getProduct().getCategory().getName())
                .imageUrl(String.valueOf(imgUrl))
                .subTotal(subTotal)
                .build();
    }

    /**
     * Clear entire cart for a user
     */
    public void clearCart(Long userId) {
        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user with ID: " + userId));
        cartItemRepo.deleteByCartId(cart.getId());
        log.info("Cleared cart for user {}", userId);
    }

    /**
     * Remove item from cart by product ID
     */
    public void removeFromCart(User user, Long productId) {
        Cart cart = user.getCart();
        List<CartItem> cartItems = cartItemRepo.findByCartId(cart.getId());
        CartItem item = null;
        for (CartItem cartItem : cartItems) {
            if (cartItem.getProduct().getId().equals(productId)) {
                item = cartItem;
            }
        };
        if (item == null) {
            throw new RuntimeException("Product with ID " + productId + " not found not found in user's cart");
        };
        cartItemRepo.delete(item);
        log.info("Removed product {} from cart for user {}", productId, user.getId());
    }

    /**
     * Get all cart items for a user
     */
    public List<CartItemResponseDto> getCartItems(User user) {
        Cart cart = user.getCart();
        return cartItemRepo.findByCartId(cart.getId())
                .stream()
                .map(this::mapper)
                .collect(Collectors.toList());
    }
}
