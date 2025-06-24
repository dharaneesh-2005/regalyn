import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useOptimizedCart } from "@/contexts/OptimizedCartContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { Product } from "@shared/schema";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Heart, Zap, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useOptimizedCart();
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(product.id, 1, {});
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);
  const discountPercentage = hasDiscount
    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
    : 0;
  
  return (
    <motion.div
      className="group relative bg-gradient-to-br from-gray-900/40 to-purple-900/20 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-primary/40 transition-all duration-700"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        y: -15,
        scale: 1.03,
        boxShadow: "0 35px 70px -12px rgba(168, 85, 247, 0.5)",
        rotateY: 5,
        filter: "brightness(1.1)"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Enhanced animated glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/15 to-purple-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        animate={isHovered ? {
          scale: [1, 1.08, 1],
          rotate: [0, 2, 0],
          background: [
            "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)",
            "linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
            "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)"
          ]
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Particle effects on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -30, -60],
                  x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <Link href={`/product/${product.slug}`}>
          <div className="relative overflow-hidden rounded-t-3xl">
            <motion.div
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-56 object-cover"
              />
            </motion.div>
            
            {/* Advanced overlay effects */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
            
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20"
              animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Futuristic badges */}
            {product.badge && (
              <motion.span 
                className="absolute top-4 left-4 bg-gradient-to-r from-primary/30 to-purple-500/30 text-primary text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm border border-primary/40"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1 }}
              >
                <Zap className="w-3 h-3 inline mr-1" />
                {product.badge}
              </motion.span>
            )}
            
            {/* Modern discount badge */}
            {hasDiscount && (
              <motion.div
                className="absolute top-4 right-4 bg-gradient-to-r from-primary to-purple-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg"
                initial={{ opacity: 0, x: 20, rotate: -10 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0]
                }}
              >
                {discountPercentage}% OFF
              </motion.div>
            )}

            {/* Hover action buttons */}
            <motion.div
              className="absolute bottom-4 right-4 flex space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary/30 border border-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={handleAddToCart}
                className="w-10 h-10 bg-primary/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary/50 border border-primary/40"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
          
          <div className="p-6">
            {/* Modern category badge */}
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="inline-flex items-center text-xs text-primary uppercase tracking-wider font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <Zap className="w-3 h-3 mr-1" />
                {product.category}
              </span>
            </motion.div>
            
            {/* Enhanced name */}
            <motion.h3 
              className="text-xl font-display font-bold text-white mb-3 line-clamp-2 min-h-[3rem] group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-500 tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {product.name}
            </motion.h3>
            
            {/* Modern description */}
            <motion.p 
              className="text-gray-300/80 text-sm mb-4 line-clamp-2 min-h-[2.5rem] leading-relaxed font-sans font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {product.shortDescription}
            </motion.p>
            
            {/* Futuristic rating display */}
            <motion.div 
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starValue = i + 1;
                    const rating = parseFloat(product.rating || '0');
                    
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + (i * 0.1) }}
                        whileHover={{ scale: 1.2 }}
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            starValue <= Math.floor(rating) 
                              ? 'text-primary fill-primary' 
                              : 'text-gray-600'
                          }`}
                        />
                      </motion.div>
                    );
                  })}
                </div>
                <span className="text-xs text-gray-400">({product.rating || '0'})</span>
              </div>
            </motion.div>
            
            {/* Futuristic Price and Action Section */}
            <motion.div 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              {/* Advanced Price Display */}
              <div className="flex items-center gap-3">
                {hasDiscount ? (
                  <>
                    <motion.span 
                      className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{ backgroundSize: "200% 200%" }}
                    >
                      {formatPrice(product.price)}
                    </motion.span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  </>
                ) : (
                  <motion.span 
                    className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    {formatPrice(product.price)}
                  </motion.span>
                )}
              </div>
              
              {/* Futuristic Quick Add Button */}
              <motion.button
                onClick={handleAddToCart}
                className="group relative bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/40 text-primary px-6 py-3 rounded-2xl font-semibold text-sm backdrop-blur-sm overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  {t("quickAdd")}
                </span>
              </motion.button>
            </motion.div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}