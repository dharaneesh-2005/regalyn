import { Link } from "wouter";
import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";
import { Watch, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Sparkles, Zap } from "lucide-react";

import logoPath from "@assets/LOGO-removebg-preview.png";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 backdrop-blur-lg border-t border-white/10 py-20 overflow-hidden">
      {/* Enhanced futuristic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-gradient-to-br from-primary/12 to-purple-500/12 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/12 to-pink-500/12 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
            x: [0, -60, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-primary/8 to-purple-500/8 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${
              i % 4 === 0 ? 'w-2 h-2 bg-primary/30 rounded-full shadow-lg shadow-primary/20' :
              i % 4 === 1 ? 'w-1 h-1 bg-purple-500/40 rounded-full shadow-lg shadow-purple-500/30' :
              i % 4 === 2 ? 'w-0.5 h-4 bg-gradient-to-b from-primary/25 to-transparent rounded-full' :
              'w-1 h-1 bg-pink-400/30 rounded-full shadow-lg shadow-pink-400/20'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50, 0],
              x: [0, Math.random() * 60 - 30, 0],
              rotate: [0, 360, 0],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 12,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="relative">
                <motion.img 
                  src={logoPath} 
                  alt="Regalyn" 
                  className="h-12 w-auto"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ duration: 0.5 }}
                />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-primary animate-pulse" />
              </div>
              <div>
                <motion.h3 
                  className="text-2xl font-display font-bold bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent tracking-wide"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  REGALYN
                </motion.h3>
                <p className="text-sm text-primary/80 tracking-widest uppercase font-mono font-medium">
                  Future Timepieces
                </p>
              </div>
            </div>
            <motion.p 
              className="text-gray-300/80 text-sm leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Pioneering the future of chronometry since 2025. Each timepiece represents 
              the perfect fusion of quantum engineering and timeless elegance.
            </motion.p>
            
            {/* Social Links */}
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 hover:border-primary/20 backdrop-blur-sm transition-all duration-500"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0]
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h4 className="text-white font-bold mb-8 text-lg flex items-center">
              <Zap className="w-4 h-4 mr-2 text-primary" />
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { href: "/", label: t("home") },
                { href: "/products", label: t("products"), icon: Watch },
                { href: "/contact", label: t("contact") }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1), duration: 0.6 }}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-center space-x-3 text-gray-300/80 hover:text-white transition-all duration-500 text-sm"
                    >
                      {Icon && <Icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors duration-300" />}
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {item.label}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h4 className="text-white font-bold mb-8 text-lg flex items-center">
              <Mail className="w-4 h-4 mr-2 text-primary" />
              Contact Info
            </h4>
            <ul className="space-y-6">
              {[
                { icon: Mail, text: "future@regalyn.tech" },
                { icon: Phone, text: "+1 (555) FUTURE-1" },
                { icon: MapPin, text: "Neo Tokyo District, Quantum City 2077" }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-4 text-gray-300/80 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1), duration: 0.6 }}
                  >
                    <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{item.text}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h4 className="text-white font-bold mb-8 text-lg flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Future Updates
            </h4>
            <p className="text-gray-300/80 text-sm mb-6 leading-relaxed">
              Subscribe to receive exclusive updates on our latest quantum timepiece 
              innovations and future technology releases.
            </p>
            <div className="space-y-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-l-2xl text-white placeholder-gray-400 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300"
                />
                <motion.button 
                  className="px-6 py-3 bg-gradient-to-r from-primary to-purple-500 text-white rounded-r-2xl hover:from-purple-500 hover:to-pink-500 transition-all duration-500 text-sm font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
              <p className="text-xs text-gray-400/60">
                Join 10,000+ visionaries shaping the future of time.
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Footer Bottom */}
        <motion.div 
          className="border-t border-white/10 mt-16 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <motion.p 
              className="text-gray-400/80 text-sm"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              © 2025 Regalyn Future Timepieces. Pioneering Tomorrow's Legacy.
            </motion.p>
            <div className="flex space-x-8 text-sm">
              {["Privacy Policy", "Terms of Service", "Quantum Warranty"].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-gray-400/80 hover:text-white transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + (index * 0.1), duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}