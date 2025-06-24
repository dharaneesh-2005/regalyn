import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useOptimizedCart } from "@/contexts/OptimizedCartContext";
import { useTranslation } from "@/contexts/LanguageContext";
import ProductCard from "@/components/ProductCard";
import LogoLoader from "@/components/LogoLoader";
import { Product } from "@shared/schema";

export default function Home() {
  const { t } = useTranslation();
  const { addToCart } = useOptimizedCart();

  // Fetch featured products with enhanced caching
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
    queryFn: () => fetch("/api/products/featured").then(res => res.json()),
    staleTime: 15 * 60 * 1000, // 15 minutes cache for featured products
  });

  // Set page title
  useEffect(() => {
    document.title = "Regalyn - Future Timepieces";
  }, []);

  return (
    <>
      {/* Futuristic Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden min-h-screen flex items-center"
      >
        {/* Advanced background system */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main gradient orbs */}
          <motion.div 
            className="absolute -top-32 -right-32 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0],
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-purple-500/15 to-pink-500/15 blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 0, 360],
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 blur-2xl"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 180, 0],
              x: [0, 60, 0],
              y: [0, -40, 0],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Enhanced particle system */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating geometric shapes */}
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute ${
                i % 4 === 0 ? 'w-4 h-4 bg-primary/40 rounded-full shadow-lg shadow-primary/25' :
                i % 4 === 1 ? 'w-3 h-3 bg-purple-500/40 rotate-45 shadow-lg shadow-purple-500/25' :
                i % 4 === 2 ? 'w-2 h-8 bg-gradient-to-b from-primary/50 to-transparent rounded-full' :
                'w-1 h-1 bg-blue-400/60 rounded-full shadow-lg shadow-blue-400/40'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -300 - 100, 0],
                x: [0, Math.random() * 200 - 100, 0],
                rotate: [0, 360, 720],
                scale: [0, 1.2, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Glowing rings */}
          <motion.div 
            className="absolute top-[15%] right-[20%] w-32 h-32 border border-primary/30 rounded-full"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute top-[70%] left-[15%] w-24 h-24 border-2 border-purple-500/40 rounded-full"
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute bottom-[30%] right-[30%] w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-sm"
            animate={{ 
              scale: [1, 2, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Futuristic content container */}
        <div className="container mx-auto px-4 py-8 md:py-16 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[80vh]">
          
            {/* Left content column with advanced animations */}
            <motion.div
              className="lg:col-span-7 text-left order-2 lg:order-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <motion.span 
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary px-6 py-3 rounded-full text-sm font-medium border border-primary/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    boxShadow: "0 0 40px rgba(168, 85, 247, 0.5)"
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span>✨ Future Heritage • Quantum Precision</span>
                </motion.span>
              </motion.div>
              
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-display font-bold text-white mb-8 leading-[0.9] tracking-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <motion.span 
                  className="block mb-4"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Next-Gen
                </motion.span>
                <motion.span 
                  className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Timepieces
                </motion.span>
              </motion.h1>
              
              <motion.p
                className="text-lg md:text-xl text-gray-300/80 mb-10 max-w-2xl leading-relaxed font-sans font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Experience the convergence of quantum engineering and timeless design. 
                Each Regalyn timepiece represents the pinnacle of innovation in chronometry, 
                crafted for the visionaries of tomorrow.
              </motion.p>
              
              <motion.div
                className="flex flex-wrap gap-6 mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.08,
                    boxShadow: "0 25px 50px -10px rgba(168, 85, 247, 0.6)",
                    filter: "brightness(1.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href="/products"
                    className="group relative bg-gradient-to-r from-primary to-purple-500 text-white px-12 py-6 rounded-2xl font-semibold text-lg inline-flex items-center gap-4 shadow-2xl border border-primary/50 overflow-hidden"
                  >
                    {/* Enhanced animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    <span className="relative z-10">Explore Future Collection</span>
                    <motion.span
                      className="relative z-10"
                      animate={{ 
                        x: [0, 8, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      ✨
                    </motion.span>
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/contact"
                    className="bg-gradient-to-r from-white/10 to-white/5 text-white px-8 py-5 rounded-2xl font-medium text-lg inline-flex items-center gap-2 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <span>Contact Us</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Right column - Futuristic Holographic Watch */}
            <motion.div 
              className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 1.2 }}
            >
              <div className="relative w-[480px] h-[480px] max-w-[85vw] max-h-[85vw] mx-auto">
                
                {/* Futuristic energy field */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-60"
                  style={{
                    background: `
                      radial-gradient(circle at 50% 50%, 
                        rgba(168, 85, 247, 0.2) 0%, 
                        rgba(147, 51, 234, 0.1) 40%, 
                        transparent 70%
                      )
                    `,
                    filter: 'blur(40px)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Main Watch Container - Modern Minimal */}
                <div className="relative w-full h-full">
                  
                  {/* Outer Ring - Sleek Modern Bezel */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 shadow-2xl border-4 border-primary/30"
                    style={{
                      boxShadow: `
                        0 0 80px rgba(168, 85, 247, 0.25),
                        inset 0 0 40px rgba(0, 0, 0, 0.8)
                      `
                    }}>
                    
                    {/* Modern Watch Face */}
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-black via-slate-950 to-slate-900 border-2 border-primary/20 shadow-inner"
                      style={{
                        boxShadow: `
                          inset 0 0 60px rgba(0, 0, 0, 0.9),
                          inset 0 0 120px rgba(168, 85, 247, 0.08)
                        `
                      }}>
                      
                      {/* Minimalist Hour Dots */}
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full bg-primary ml-[9px] mr-[9px]"
                          style={{
                            width: i % 3 === 0 ? '8px' : '4px',
                            height: i % 3 === 0 ? '8px' : '4px',
                            left: '50%',
                            top: '20px',
                            transform: `translateX(-50%) rotate(${i * 30}deg)`,
                            transformOrigin: `${i % 3 === 0 ? '4px' : '2px'} ${i % 3 === 0 ? '200px' : '202px'}`,
                            boxShadow: `0 0 ${i % 3 === 0 ? '15px' : '8px'} rgba(168, 85, 247, 0.8)`,
                          }}
                        />
                      ))}
                      
                      {/* Hour Numbers - Modern Typography */}
                      {[12, 3, 6, 9].map((num, i) => (
                        <div
                          key={num}
                          className="absolute text-primary font-light text-2xl select-none"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `translateX(-50%) translateY(-50%) translateY(${
                              i === 0 ? '-120px' : i === 1 ? '0px' : i === 2 ? '120px' : '0px'
                            }) translateX(${
                              i === 1 ? '120px' : i === 3 ? '-120px' : '0px'
                            })`,
                            textShadow: '0 0 20px rgba(168, 85, 247, 1)',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                          }}
                        >
                          {num}
                        </div>
                      ))}
                      
                      {/* Modern Watch Hands */}
                      <div className="absolute inset-0">
                        {/* Hour hand - Sleek design */}
                        <div
                          className="absolute bg-gradient-to-t from-primary to-purple-300 shadow-lg z-10"
                          style={{
                            width: '6px',
                            height: '80px',
                            left: '50%',
                            top: '50%',
                            transform: 'translateX(-50%) translateY(-100%) rotate(60deg)',
                            transformOrigin: '3px 80px',
                            borderRadius: '3px 3px 0 0',
                            boxShadow: '0 0 25px rgba(168, 85, 247, 0.9)',
                          }}
                        />
                        
                        {/* Minute hand - Elegant design */}
                        <div
                          className="absolute bg-gradient-to-t from-purple-400 to-purple-200 shadow-lg z-10"
                          style={{
                            width: '4px',
                            height: '110px',
                            left: '50%',
                            top: '50%',
                            transform: 'translateX(-50%) translateY(-100%) rotate(300deg)',
                            transformOrigin: '2px 110px',
                            borderRadius: '2px 2px 0 0',
                            boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)',
                          }}
                        />
                        

                      </div>
                      
                      {/* Modern Center Hub */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 z-20"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-purple-600 shadow-lg ml-[-9px] mr-[-9px] mt-[-11px] mb-[-11px]"
                          style={{
                            boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)'
                          }}>
                        </div>
                      </motion.div>
                      
                      {/* Brand Text - Modern Minimal */}
                      <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 text-center">
                        <motion.div
                          className="text-primary font-light text-lg tracking-[0.4em] mb-2"
                          style={{ 
                            textShadow: '0 0 20px rgba(168, 85, 247, 0.8)',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                          }}
                          animate={{
                            opacity: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          REGALYN
                        </motion.div>
                        <div className="text-purple-300 text-xs tracking-[0.3em] font-light opacity-80">QUANTUM SERIES</div>
                      </div>
                      
                      {/* Modern Date Display */}
                      <div className="absolute right-[15%] top-1/2 transform -translate-y-1/2 w-8 h-5 bg-black border border-primary/40 rounded shadow-inner"
                        style={{
                          boxShadow: 'inset 0 0 8px rgba(168, 85, 247, 0.2)'
                        }}>
                        <div className="w-full h-full flex items-center justify-center text-primary font-light text-xs"
                          style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.8)' }}>
                          23
                        </div>
                      </div>
                      
                      {/* Minimalist Power Reserve Indicator */}
                      <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border border-primary/30 bg-black/60 shadow-inner"
                        style={{
                          boxShadow: 'inset 0 0 10px rgba(168, 85, 247, 0.1)'
                        }}>
                        <motion.div
                          className="absolute inset-1 rounded-full bg-gradient-to-r from-primary/20 to-purple-400/20"
                          animate={{
                            rotate: [0, 180, 360],
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          <div className="absolute w-0.5 h-2 bg-primary top-0.5 left-1/2 transform -translate-x-1/2 rounded-sm"
                            style={{
                              boxShadow: '0 0 4px rgba(168, 85, 247, 0.8)',
                            }}
                          />
                        </motion.div>
                      </div>
                      
                      {/* Subtle Accent Lines */}
                      <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                      <div className="absolute bottom-[70%] left-1/2 transform -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
                    </div>
                    
                    {/* Modern Crown */}
                    <div className="absolute right-0 top-1/2 w-4 h-8 transform -translate-y-1/2 translate-x-1">
                      <div className="w-full h-full bg-gradient-to-r from-slate-700 to-slate-600 rounded-r border border-primary/30 shadow-lg"
                        style={{
                          boxShadow: '0 0 10px rgba(168, 85, 247, 0.2)'
                        }}>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Featured Products Section with futuristic design */}
      <section className="py-32 relative overflow-hidden">
        {/* Advanced background system */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary/15 to-purple-500/15 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 360, 0],
              x: [0, 80, 0],
              y: [0, -40, 0],
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-purple-500/12 to-pink-500/12 blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 0, 360],
              x: [0, -60, 0],
              y: [0, 50, 0],
            }}
            transition={{ 
              duration: 35, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-primary/8 to-purple-500/8 blur-2xl"
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              Featured{" "}
              <motion.span 
                className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
                style={{ backgroundSize: "200% 200%" }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Collection
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300/80 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Explore quantum-engineered timepieces that transcend traditional horology. 
              Each piece represents the pinnacle of future craftsmanship and innovative design.
            </motion.p>
            
            {/* Floating elements */}
            <motion.div
              className="flex justify-center space-x-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {["Quantum Precision", "Future Design", "Timeless Elegance"].map((text, index) => (
                <motion.div
                  key={text}
                  className="bg-gradient-to-r from-primary/20 to-purple-500/20 px-6 py-3 rounded-full border border-primary/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -5 }}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    y: {
                      duration: 3 + index,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <span className="text-primary text-sm font-medium">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center">
              <LogoLoader />
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {featuredProducts?.slice(0, 6).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + (index * 0.1), duration: 0.6 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* View All Products */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary px-8 py-4 rounded-2xl font-semibold border border-primary/30 backdrop-blur-sm hover:from-primary/30 hover:to-purple-500/30 transition-all duration-500"
              >
                <span>View All Timepieces</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}