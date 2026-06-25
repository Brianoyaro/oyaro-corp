import { useContext, useCallback, useEffect, useState, createContext } from "react";
import { AuthContext } from "./AuthContext";
import { cartApi } from "../api/cartApi";


export const CartContext = createContext();


const STORAGE_KEY = 'cart';

const transformBackEndCart = (item) => {
    const API_IMAGE_BASE_URL = import.meta.env.VITE_API_IMAGE_BASE_URL || 'http://localhost:8080';
    const imgUrl = `${API_IMAGE_BASE_URL}${item.imgageUrl}`

    return {
        id: item.id,//cartItemId from the database. I find it redundant here
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        imgUrl: imgUrl,
        subTotal: item.subTotal,
        productCategoryName: item.productCategoryName
    }

};

//
export function CartProvider({children}) {
  const { isAuthenticated, isLoading: authLoading } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [isLoading, setLoading] = useState(false);   
  const [hasInitialized, setHasInitialized] = useState(false)
  

  // initialize cart: use localStorage or fetch from the backend
  useEffect(() => {
    if (authLoading) return; //waith for authentication to complete

    const initializeCart = async ()  => {
        try {
            setLoading(true)
            if (isAuthenticated) {
                // Check if there are items in localStorage i.e. user was guest before logging in.
                const storedCart = localStorage.getItem(STORAGE_KEY);
                if (storedCart) {
                    const guestCart = JSON.parse(storedCart)
                    for (const item of guestCart) {
                        try {
                            await cartApi.addToCart({
                                "productId": item.productId,
                                "quantity": item.quantity
                            });
                            console.log(`Successfully uploaded ${item.productName} to the backend`)
                        } catch (error) {
                            console.error(`Failed to migrate item: ${item.name}`)
                        }
                    }
                    localStorage.removeItem(STORAGE_KEY)
                    console.log('cart migration complete :)')
                }

                // load from backend cart
                const response = await cartApi.getCart();
                const transformedResponse = (response|| []).map(transformBackEndCart);
                setCart(transformedResponse)
            } else {
                // store in local storage
                const storedCart = localStorage.getItem(STORAGE_KEY)
                setCart(storedCart ? JSON.parse(storedCart) : []);
            }
        } catch (error) {
            //
            console.error(`Failed to intize cart. Error: ${error}`)
        } finally {
            setHasInitialized(true)
            setLoading(false)
        }
    };
    initializeCart();
  }, [isAuthenticated, authLoading]);

  const addToCart = useCallback(
    async(item) => {
        try {
            setLoading(true)
            console.log(`Adding ${item.name} to cart`)
            
            if (isAuthenticated) {
                await cartApi.addToCart
                ({
                    "productId": item.productId,
                    "quantity": item.quantity
                });
                console.log(`Successfully uploaded ${item.productName} to the backend`)
                // refetch update
                const response = await cartApi.getCart()
                const transformedResponse = (response|| []).map(transformBackEndCart);
                setCart(transformedResponse)
            } else {
                // Update localStorage
                const existingItem = cart.find((product) => product.productId === item.id);
                let updatedCart;

                if (existingItem) {
                    updatedCart = cart.map((product) =>
                    product.productId === product.id
                        ? { 
                            ...product, 
                            quantity: product.quantity + (item.quantity || 1) , 
                            subTotal: (product.quantity + (item.quantity || 1)) * product.unitPrice}
                        : product
                    );
                } else {
                    updatedCart = [
                    ...cart,
                    {
                        productId: item.id,
                        productName: item.name,
                        unitPrice: item.price,
                        imgUrl: item.images?.[0]?.imgUrl,
                        productCategoryName: item.categoryName,
                        quantity: item.quantity || 1,
                        subTotal: item.price * (item.quantity || 1)
                    },
                    ];
                }
                setCart(updatedCart);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCart))
            }

            console.log("Finished adding item to cart")
        } catch (error) {
            console.error("Error adding product to cart");
            throw error;
        } finally {
            setLoading(false)
        }
    }, [cart, isAuthenticated]
  );

  const removeFromCart = useCallback(
    async (cartItemId) => {
        try {
            setLoading(true);
            if (isAuthenticated) {
                // Find the item to get its product ID
                const item = cart.find(i => i.id === cartItemId);
                if (item) {
                    // Call backend with product ID
                    await cartAPI.removeFromCart(item.productId);
                    // Refetch cart from backend
                    const response = await cartApi.getCart();
                    const backendCart = (response.items || []).map(transformBackendCart);
                    setCart(backendCart);
                }
            } else {
                // Update localStorage
                const updatedCart = cart.filter((item) => item.productId !== cartItemId);
                setCart(updatedCart);
                localStorage.setItem(STORAGE_KEY, updateCart)
            }
            console.log("Successfully removed product from cart")
        } catch (error) {
            console.error("Error removing item from cart")
            throw error;
        } finally {
            setLoading(false)
        }
    }, [cart, isAuthenticated]
  );

  const clearCart = useCallback(
    async () => {
        try {
            setLoading(true)
            if (isAuthenticated){
                // Remove all items from backend using product ID
                for (const item of cart) {
                    try {
                        await cartAPI.removeFromCart(item.productId);
                    } catch (err) {
                        console.warn(`⚠️ Failed to remove item ${item.id} from backend:`, err);
                    }
                }
            }
            setCart([]);
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
            console.log("Successfully cleared the cart")
        } catch (error) {
            console.error("Error encountered during cart clearing operation")
            throw error;
        } finally {
            setLoading(false)
        }
    }, [cart, isAuthenticated]
  );

  const updateCart = useCallback(
    async (cartItemId, quantity) => {
        try {
            setLoading(true)
            if (quantity <= 0) {
                await removeFromCart(cartItemId);
                return;
            }
            //
            if (isAuthenticated) {
                // Call backend with CartItem ID (not product ID)
                await cartAPI.updateQuantity(cartItemId, quantity);
                // Refetch cart from backend
                const response = await cartAPI.getCart();
                const backendCart = (response.items || []).map(transformBackendCart);
                setCart(backendCart);
            } else {
                // Update localStorage - guest cart uses product ID
                const updatedCart = cart.map((item) =>
                    item.productId === cartItemId ? { ...item, quantity } : item
                );
                setCart(updatedCart);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updateCart))
            }
        } catch (error) {
            console.error("Error enctoured during product update")
            throw error;
        } finally {
            setLoading(false)
        }

    }, [cart, isAuthenticated, removeFromCart]
  );

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  }, [cart]);


  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);



    const value = {
        //
        cart,
        isLoading,
        hasInitialized,
        addToCart,
        removeFromCart,
        clearCart,
        updateCart,
        getCartItemCount,
        getCartTotal,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}