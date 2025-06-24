import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";
import { useOptimizedCart } from "@/contexts/OptimizedCartContext";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { calculateCartSummary, formatPrice } from "@/lib/cart";
import LogoLoader from "@/components/LogoLoader";

export default function Cart() {
  const { t } = useTranslation();
  const { cartItems, updateQuantity, removeFromCart, clearCart, isLoading } = useOptimizedCart();
  const { user } = useAuth();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const { toast } = useToast();
  const { subtotal, shipping, tax, total } = calculateCartSummary(cartItems);
  
  // Set page title
  useEffect(() => {
    document.title = `${t('cart')} - Regalyn`;
  }, [t]);
  
  // Initialize quantities state from cart items
  useEffect(() => {
    const initialQuantities: { [key: number]: number } = {};
    cartItems.forEach(item => {
      initialQuantities[item.id] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);
  
  // Update quantity locally and in the cart automatically
  const handleQuantityChange = async (itemId: number, value: string) => {
    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      // Find the corresponding item to get its product
      const cartItem = cartItems.find(item => item.id === itemId);
      if (!cartItem || !cartItem.product) return;
      
      // Limit quantity to available stock
      const maxQuantity = cartItem.product.stockQuantity || Number.MAX_SAFE_INTEGER;
      const limitedQuantity = Math.min(newQuantity, maxQuantity);
      
      setQuantities(prev => ({
        ...prev,
        [itemId]: limitedQuantity
      }));
      
      // Debounce the update to prevent excessive API calls
      try {
        await updateQuantity(itemId, limitedQuantity);
      } catch (error) {
        console.error("Error updating cart item:", error);
        toast({
          title: "Error",
          description: t('errorOccurred'),
          variant: "destructive",
        });
      }
    }
  };
  
  // Remove item from cart
  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast({
        title: "Error",
        description: t('errorOccurred'),
        variant: "destructive",
      });
    }
  };
  
  // Clear entire cart
  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: t('errorOccurred'),
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      {/* Cart Header */}
      <section className="pt-28 pb-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Elegant background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/8 to-primary/4 border border-primary/5"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 360, 0],
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Shopping Cart
            </span>
          </motion.h1>
          
          {/* Breadcrumb */}
          <motion.div 
            className="flex items-center space-x-2 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/" className="hover:text-yellow-400 transition-colors">
              {t('home')}
            </Link>
            <span>/</span>
            <span className="text-yellow-400">{t('cart')}</span>
          </motion.div>
        </div>
      </section>
      
      {/* Cart Content */}
      <section className="py-12 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LogoLoader size="medium" text="Loading cart items..." />
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div 
                  className="bg-black/60 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-yellow-400/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="p-6 border-b border-yellow-400/20">
                    <h2 className="text-xl font-semibold text-white">
                      {t('cart')} ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                    </h2>
                  </div>
                  
                  <ul>
                    {cartItems.map((item) => {
                      // Extract weight information from metaData
                      let selectedWeight = 'Standard';
                      try {
                        if (item.metaData) {
                          const metadata = JSON.parse(item.metaData);
                          if (metadata && metadata.selectedWeight) {
                            selectedWeight = metadata.selectedWeight;
                          }
                        }
                      } catch (error) {
                        console.error("Error parsing weight data:", error);
                      }
                      
                      // Generate a truly unique key for React rendering
                      const randomSuffix = Math.random().toString(36).substring(2, 10);
                      const itemKey = `${item.id}-${selectedWeight}-${randomSuffix}`;
                      
                      return (
                        <motion.li 
                          key={itemKey} 
                          className="p-6 border-b border-yellow-400/10"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="w-24 h-24 flex-shrink-0">
                              <img 
                                src={item.product?.imageUrl} 
                                alt={item.product?.name} 
                                className="w-full h-full object-cover rounded-md border border-yellow-400/20"
                              />
                            </div>
                            
                            <div className="flex-grow text-center md:text-left">
                              <h3 className="text-lg font-medium text-white">
                                {item.product?.name}
                              </h3>
                              <p className="text-sm text-gray-400 mb-2">
                                {item.product?.shortDescription?.substring(0, 60)}
                                {item.product?.shortDescription && item.product.shortDescription.length > 60 ? '...' : ''}
                              </p>
                              
                              {/* Display weight badge */}
                              <div className="mb-2 mt-1 inline-block bg-yellow-400/10 px-2 py-1 rounded-md border border-yellow-400/20">
                                <p className="text-sm text-yellow-400">
                                  <span className="font-medium">Weight: </span>
                                  <span className="font-bold">{selectedWeight}</span>
                                </p>
                              </div>
                              
                              <p className="text-yellow-400 font-bold">
                                {formatPrice(item.product?.price || 0)}
                              </p>
                            </div>
                            
                            <div className="flex flex-col items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                              <div className="flex items-center border border-yellow-400/30 rounded-md overflow-hidden bg-black/40">
                                <button 
                                  className="px-3 py-1 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 focus:outline-none transition-colors"
                                  onClick={() => {
                                    const newQuantity = Math.max(1, quantities[item.id] - 1);
                                    handleQuantityChange(item.id, newQuantity.toString());
                                  }}
                                >-</button>
                                <input 
                                  type="number" 
                                  className="w-14 text-center py-1 bg-transparent text-white focus:outline-none" 
                                  value={quantities[item.id] || item.quantity}
                                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                  min="1"
                                  max={item.product?.stockQuantity || 999}
                                />
                                <button 
                                  className="px-3 py-1 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 focus:outline-none transition-colors"
                                  onClick={() => {
                                    // Find the current stock quantity
                                    const maxQuantity = item.product?.stockQuantity || Number.MAX_SAFE_INTEGER;
                                    // Ensure new quantity doesn't exceed stock
                                    const newQuantity = Math.min((quantities[item.id] || item.quantity) + 1, maxQuantity);
                                    handleQuantityChange(item.id, newQuantity.toString());
                                  }}
                                >+</button>
                              </div>
                              
                              <div className="w-full text-center">
                                <motion.button 
                                  className="bg-red-600/80 text-white px-4 py-1.5 rounded-md hover:bg-red-700 focus:outline-none transition-colors text-sm w-full md:w-auto border border-red-600/30"
                                  onClick={() => handleRemoveItem(item.id)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {t('removeItem')}
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                  
                  <div className="p-6 flex justify-between items-center border-t border-yellow-400/20">
                    <motion.button 
                      className="text-red-400 hover:text-red-300 transition-colors"
                      onClick={handleClearCart}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t('clearCart')}
                    </motion.button>
                    <Link href="/products" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                      {t('continueShopping')}
                    </Link>
                  </div>
                </motion.div>
              </div>
              
              {/* Cart Summary */}
              <div>
                <motion.div 
                  className="bg-black/60 backdrop-blur-sm rounded-xl shadow-2xl p-6 sticky top-24 border border-yellow-400/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold text-white mb-6">
                    {t('cart')} {t('summary')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-yellow-400/20 pb-4">
                      <span className="text-gray-300">{t('subtotal')}</span>
                      <span className="font-medium text-white">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between border-b border-yellow-400/20 pb-4">
                      <span className="text-gray-300">{t('shipping')}</span>
                      <span className="font-medium text-white">{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between border-b border-yellow-400/20 pb-4">
                      <span className="text-gray-300">{t('tax')}</span>
                      <span className="font-medium text-white">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between pb-4">
                      <span className="text-white font-semibold">{t('total')}</span>
                      <span className="text-yellow-400 font-bold text-xl">{formatPrice(total)}</span>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href="/checkout" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all flex items-center justify-center font-medium border border-yellow-400/50 shadow-lg">
                        {t('proceedToCheckout')}
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <motion.div 
              className="bg-black/60 backdrop-blur-sm rounded-xl shadow-2xl p-12 text-center border border-yellow-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center">
                <motion.i 
                  className="fas fa-shopping-cart text-yellow-400/50 text-6xl mb-6"
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                ></motion.i>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('emptyCart')}
                </h2>
                <p className="text-gray-300 mb-8">
                  Browse our collection and discover our premium luxury timepieces.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/products" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all font-medium border border-yellow-400/50 shadow-lg">
                    {t('continueShopping')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}