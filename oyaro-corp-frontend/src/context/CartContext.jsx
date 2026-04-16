import { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../service/cartService';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));

  // Initialize cart on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    if (!token) {
      // Load from local storage
      setCart(cartService.getLocalCart());
    }
  }, []);

  // Listen for storage changes (logout in another tab, etc.)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('accessToken');
      if(!token && isLoggedIn) {
        setIsLoggedIn(false);
        setCart(cartService.getLocalCart());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isLoggedIn]);

  const addToCart = (product, quantity = 1) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      // Use backend cart
      cartService
        .addToCart(product.id, quantity)
        .then((response) => {
          setCart(response.data);
        })
        .catch((error) => console.error('Failed to add to cart:', error));
    } else {
      // Use local cart
      const updatedCart = cartService.addToLocalCart(product, quantity);
      setCart(updatedCart);
    }
  };

  const updateCartItem = (productId, quantity) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      cartService
        .updateCartItem(productId, quantity)
        .then((response) => {
          setCart(response.data);
        })
        .catch((error) => console.error('Failed to update cart:', error));
    } else {
      const updatedCart = cartService.updateLocalCartItem(productId, quantity);
      setCart(updatedCart);
    }
  };

  const removeFromCart = (productId) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      cartService
        .removeFromCart(productId)
        .then((response) => {
          setCart(response.data);
        })
        .catch((error) => console.error('Failed to remove from cart:', error));
    } else {
      const updatedCart = cartService.removeFromLocalCart(productId);
      setCart(updatedCart);
    }
  };

  const clearCart = () => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      cartService
        .clearCart()
        .then(() => {
          setCart([]);
        })
        .catch((error) => console.error('Failed to clear cart:', error));
    } else {
      cartService.clearLocalCart();
      setCart([]);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cart,
    setCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isLoggedIn,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
