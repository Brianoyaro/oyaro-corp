package online.mavunohub.ecommerce.Cart.repository;

import online.mavunohub.ecommerce.Cart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Long> {

    /**
     * Find all items in a specific cart
     * @param cartId the cart ID
     * @return list of cart items
     */
    List<CartItem> findByCartId(Long cartId);

    /**
     * Delete all items from a cart
     * @param cartId the cart ID
     */
    void deleteByCartId(Long cartId);

}