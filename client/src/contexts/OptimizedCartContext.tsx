import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode,
  useCallback,
  useRef
} from "react";
import { useToast } from "@/hooks/use-toast";
import { CartItem, Product } from "@shared/schema";
import { dataService } from "@/lib/dataService";

interface ExtendedCartItem extends CartItem {
  product?: Product;
  _isOptimistic?: boolean;
  _updating?: boolean;
}

interface OptimizedCartContextType {
  cartItems: ExtendedCartItem[];
  isLoading: boolean;
  addToCart: (productId: number, quantity: number, options?: any) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  refreshCart: () => Promise<void>;
  isInCart: (productId: number, selectedWeight?: string) => boolean;
  getCartItemQuantity: (productId: number, selectedWeight?: string) => number;
}

const OptimizedCartContext = createContext<OptimizedCartContextType | undefined>(undefined);

export function OptimizedCartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<ExtendedCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize cart data on mount
  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await dataService.getCartItems();
      
      // Enrich cart items with product data from cache
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          const product = await dataService.getProduct(item.productId);
          return {
            ...item,
            product: product || undefined,
          };
        })
      );
      
      setCartItems(enrichedItems);
    } catch (error) {
      console.error("Error loading cart:", error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addToCart = useCallback(async (productId: number, quantity: number, options?: any) => {
    if (quantity <= 0) return;

    try {
      setIsLoading(true);
      
      // Get product details from cache first
      const product = await dataService.getProduct(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // Check stock availability
      const maxQuantity = product.stockQuantity || Number.MAX_SAFE_INTEGER;
      const safeQuantity = Math.min(quantity, maxQuantity);
      
      if (safeQuantity !== quantity) {
        toast({
          title: "Stock Limited",
          description: `Only ${maxQuantity} items available. Added ${safeQuantity} to cart.`,
          variant: "destructive",
        });
      }

      // Process weight-based pricing if applicable
      let metaData: any = {};
      let displayPrice = product.price;
      
      if (options?.selectedWeight && product.weightPrices) {
        try {
          const weightPrices = JSON.parse(product.weightPrices);
          if (weightPrices[options.selectedWeight]) {
            const priceData = weightPrices[options.selectedWeight];
            displayPrice = typeof priceData === 'object' ? priceData.price : priceData;
            metaData.selectedWeight = options.selectedWeight;
          }
        } catch (e) {
          console.error("Error parsing weight prices:", e);
        }
      }

      // Check if item already exists in cart
      const existingItem = cartItems.find(item => {
        if (item.productId !== productId) return false;
        
        if (metaData.selectedWeight) {
          try {
            const itemMeta = item.metaData ? JSON.parse(item.metaData) : {};
            return itemMeta.selectedWeight === metaData.selectedWeight;
          } catch (e) {
            return false;
          }
        }
        
        return !item.metaData || item.metaData === '{}';
      });

      if (existingItem) {
        // Update existing item quantity
        const newQuantity = existingItem.quantity + safeQuantity;
        await updateQuantity(existingItem.id, newQuantity);
      } else {
        // Optimistic update first for instant UI feedback
        const tempItem: ExtendedCartItem = {
          id: -Date.now(), // Temporary negative ID
          productId,
          quantity: safeQuantity,
          metaData: Object.keys(metaData).length > 0 ? JSON.stringify(metaData) : null,
          sessionId: localStorage.getItem('cartSessionId') || '',
          userId: null,
          createdAt: new Date(),
          product: {
            ...product,
            price: displayPrice,
          },
          _isOptimistic: true,
        };

        // Update UI immediately
        setCartItems(prev => [...prev, tempItem]);
        
        // Show success message immediately
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart`,
        });

        // Make API call in background
        try {
          await dataService.addToCart(productId, safeQuantity, metaData);
          
          // Replace optimistic item with real data after API success
          await loadCartData();
        } catch (error) {
          // Remove optimistic item on failure
          setCartItems(prev => prev.filter(item => item.id !== tempItem.id));
          
          toast({
            title: "Error",
            description: "Failed to add item to cart",
            variant: "destructive",
          });
          throw error;
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [cartItems, toast]);

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      // Optimistic update
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity, _updating: true } : item
      ));

      // Debounce API calls for quantity updates
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(async () => {
        try {
          const updatedItems = await dataService.updateCartItem(itemId, quantity);
          
          const enrichedItems = await Promise.all(
            updatedItems.map(async (item) => {
              const product = await dataService.getProduct(item.productId);
              return {
                ...item,
                product: product || undefined,
              };
            })
          );
          
          setCartItems(enrichedItems);
        } catch (error) {
          console.error("Error updating cart:", error);
          // Revert optimistic update
          await loadCartData();
          toast({
            title: "Error",
            description: "Failed to update cart item",
            variant: "destructive",
          });
        }
      }, 500); // 500ms debounce
    } catch (error) {
      console.error("Error updating quantity:", error);
      await loadCartData();
    }
  }, [loadCartData, toast]);

  const removeFromCart = useCallback(async (itemId: number) => {
    try {
      // Optimistic update
      const itemToRemove = cartItems.find(item => item.id === itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));

      const updatedItems = await dataService.removeFromCart(itemId);
      
      const enrichedItems = await Promise.all(
        updatedItems.map(async (item) => {
          const product = await dataService.getProduct(item.productId);
          return {
            ...item,
            product: product || undefined,
          };
        })
      );
      
      setCartItems(enrichedItems);
      
      if (itemToRemove?.product) {
        toast({
          title: "Removed from Cart",
          description: `${itemToRemove.product.name} has been removed from your cart`,
        });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      await loadCartData();
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  }, [cartItems, loadCartData, toast]);

  const clearCart = useCallback(async () => {
    try {
      // Optimistic update
      setCartItems([]);
      
      await dataService.clearCart();
      
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      await loadCartData();
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  }, [loadCartData, toast]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      if (!item.product) return total;
      
      let price = parseFloat(item.product.price);
      
      // Handle weight-based pricing
      if (item.metaData && item.product.weightPrices) {
        try {
          const metaData = JSON.parse(item.metaData);
          const weightPrices = JSON.parse(item.product.weightPrices);
          
          if (metaData.selectedWeight && weightPrices[metaData.selectedWeight]) {
            const priceData = weightPrices[metaData.selectedWeight];
            price = parseFloat(typeof priceData === 'object' ? priceData.price : priceData);
          }
        } catch (e) {
          // Use default price if parsing fails
        }
      }
      
      return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const refreshCart = useCallback(async () => {
    await loadCartData();
  }, [loadCartData]);

  const isInCart = useCallback((productId: number, selectedWeight?: string) => {
    return cartItems.some(item => {
      if (item.productId !== productId) return false;
      
      if (selectedWeight) {
        try {
          const metaData = item.metaData ? JSON.parse(item.metaData) : {};
          return metaData.selectedWeight === selectedWeight;
        } catch (e) {
          return false;
        }
      }
      
      return true;
    });
  }, [cartItems]);

  const getCartItemQuantity = useCallback((productId: number, selectedWeight?: string) => {
    const item = cartItems.find(item => {
      if (item.productId !== productId) return false;
      
      if (selectedWeight) {
        try {
          const metaData = item.metaData ? JSON.parse(item.metaData) : {};
          return metaData.selectedWeight === selectedWeight;
        } catch (e) {
          return false;
        }
      }
      
      return true;
    });
    
    return item?.quantity || 0;
  }, [cartItems]);

  const value: OptimizedCartContextType = {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    refreshCart,
    isInCart,
    getCartItemQuantity,
  };

  return (
    <OptimizedCartContext.Provider value={value}>
      {children}
    </OptimizedCartContext.Provider>
  );
}

export const useOptimizedCart = () => {
  const context = useContext(OptimizedCartContext);
  if (context === undefined) {
    throw new Error('useOptimizedCart must be used within an OptimizedCartProvider');
  }
  return context;
};