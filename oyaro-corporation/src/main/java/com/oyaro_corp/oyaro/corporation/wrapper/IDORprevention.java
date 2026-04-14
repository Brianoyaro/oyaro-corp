package com.oyaro_corp.oyaro.corporation.wrapper;

import com.oyaro_corp.oyaro.corporation.Authentication.entity.User;
import com.oyaro_corp.oyaro.corporation.cart.entity.Cart;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.nio.file.AccessDeniedException;
import java.util.Objects;

public class IDORprevention {
    // Ensure that this cart belongs to me to prevent malicious users from tampering with other peoples carts by modifying the userid parameter in the url
    public static void isThisMyId(Long userId) throws AccessDeniedException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        User user = (User) authentication.getPrincipal();
        assert user != null;
        if (!user.getId().equals(userId)) {
            throw new AccessDeniedException("Unauthorized action");
//            return false;
        }
    }

    public static void isThisMyCart(Cart cart) throws AccessDeniedException {
        // ✅ Verify the cart belongs to the authenticated user
        User user = (User) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getPrincipal();
        assert user != null;
        if (!cart.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized");
        }
    }
}
