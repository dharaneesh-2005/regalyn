import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useOptimizedCart } from "@/contexts/OptimizedCartContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { ShoppingBag, Menu, X, Watch, Home, Mail, Sparkles, Zap } from "lucide-react";

import logoPath from "@assets/LOGO-removebg-preview.png";

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [location] = useLocation();
  const { getCartCount } = useOptimizedCart();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const cartItemCount = getCartCount();

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const isActivePath = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path === "/products" && location === "/products") return true;
    if (path === "/contact" && location === "/contact") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Floating Header */}
      <motion.header 
        className={`fixed w-full top-4 z-50 px-4 transition-all duration-700 ${
          isScrolled 
            ? 'top-2' 
            : 'top-4'
        }`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.nav 
            className={`relative backdrop-blur-2xl border border-white/10 shadow-2xl transition-all duration-700 ${
              isScrolled 
                ? 'bg-black/40 rounded-3xl py-3 px-6' 
                : 'bg-black/20 rounded-3xl py-4 px-8'
            }`}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-20 blur-sm"></div>
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90"></div>
            
            <div className="relative flex items-center justify-between">
              {/* Logo with particle effects */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex-shrink-0 relative"
              >
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.img 
                      src={logoPath} 
                      alt="Regalyn" 
                      className="h-10 w-auto relative z-10"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 }
                      }}
                    />
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="hidden sm:block">
                    <motion.h1 
                      className="text-2xl font-display font-bold bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent tracking-wide"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      REGALYN
                    </motion.h1>
                    <p className="text-xs text-primary/80 tracking-widest uppercase font-mono font-medium">
                      Future Timepieces
                    </p>
                  </div>
                </Link>
              </motion.div>
              
              {/* Futuristic Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {[
                  { path: '/', label: t('home'), icon: Home },
                  { path: '/products', label: t('products'), icon: Watch },
                  { path: '/contact', label: t('contact'), icon: Mail }
                ].map((item, index) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path === '/' ? item.path : item.path.substring(1));
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1), duration: 0.6 }}
                      className="relative"
                    >
                      <Link 
                        href={item.path} 
                        className={`group relative flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-500 ${
                          isActive
                            ? 'text-white bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30' 
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {/* Hover effect background */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ scale: 1.05 }}
                        />
                        
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-500/20"
                            layoutId="activeNavItem"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        
                        <Icon className={`w-4 h-4 relative z-10 transition-colors duration-300 ${
                          isActive ? 'text-primary' : 'group-hover:text-primary'
                        }`} />
                        <span className="font-medium text-sm relative z-10">{item.label}</span>
                        
                        {/* Magic sparkle effect */}
                        {isActive && (
                          <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{
                              scale: [1, 1.5, 1],
                              rotate: [0, 180, 360],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <Zap className="w-3 h-3 text-primary" />
                          </motion.div>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Futuristic Actions */}
              <div className="flex items-center space-x-3">
                {/* Advanced Cart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="relative"
                >
                  <Link href="/cart" className="group relative">
                    <motion.div 
                      className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 backdrop-blur-lg transition-all duration-500 group-hover:from-primary/30 group-hover:to-purple-500/30 group-hover:border-primary/50"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingBag className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                      
                      {/* Pulse effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-primary/20"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0, 0.3, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                    
                    {/* Futuristic cart count */}
                    <AnimatePresence>
                      {cartItemCount > 0 && (
                        <motion.div
                          className="absolute -top-2 -right-2"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", bounce: 0.6 }}
                        >
                          <motion.span 
                            className="flex items-center justify-center min-w-[24px] h-6 bg-gradient-to-r from-primary to-purple-500 text-black text-xs font-bold rounded-full px-2 shadow-lg border border-white/20"
                            animate={{
                              boxShadow: [
                                "0 0 10px rgba(168, 85, 247, 0.5)",
                                "0 0 20px rgba(168, 85, 247, 0.8)",
                                "0 0 10px rgba(168, 85, 247, 0.5)"
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            {cartItemCount}
                          </motion.span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
                
                {/* Mobile menu toggle */}
                <motion.button 
                  className="md:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 backdrop-blur-lg transition-all duration-300 hover:from-primary/30 hover:to-purple-500/30"
                  onClick={toggleMobileMenu}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: showMobileMenu ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {showMobileMenu ? (
                      <X className="w-5 h-5 text-primary" />
                    ) : (
                      <Menu className="w-5 h-5 text-primary" />
                    )}
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </motion.nav>
        </div>
        
        {/* Futuristic Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div 
              className="md:hidden absolute top-full left-4 right-4 mt-4 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="p-6 space-y-4">
                {[
                  { path: '/', label: t('home'), icon: Home },
                  { path: '/products', label: t('products'), icon: Watch },
                  { path: '/contact', label: t('contact'), icon: Mail }
                ].map((item, index) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path === '/' ? item.path : item.path.substring(1));
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.4 }}
                    >
                      <Link 
                        href={item.path}
                        className={`flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 ${
                          isActive
                            ? 'text-white bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30' 
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-4 h-4 text-primary ml-auto" />
                          </motion.div>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Cursor follower effect */}
      <motion.div
        className="fixed w-6 h-6 rounded-full bg-gradient-to-r from-primary to-purple-500 opacity-20 pointer-events-none z-40 mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5
        }}
      />
    </>
  );
}