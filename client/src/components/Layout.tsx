import { ReactNode } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import LanguageSelector from "./LanguageSelector";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-white overflow-x-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary/12 to-purple-500/12 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 80, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-gradient-to-tr from-purple-500/12 to-pink-500/12 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
            x: [0, -60, 0],
            y: [0, 70, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-primary/8 to-purple-500/8 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [-80, 80, -80],
            y: [-50, 50, -50],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${
              i % 3 === 0 ? 'w-2 h-2 bg-primary/30 rounded-full' :
              i % 3 === 1 ? 'w-1 h-1 bg-purple-500/40 rounded-full' :
              'w-0.5 h-4 bg-gradient-to-b from-primary/20 to-transparent'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -200 - 100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 360, 0],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 12 + 15,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <LanguageSelector />
      <Header />
      
      <motion.main 
        className="flex-grow pt-28 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.main>
      
      <Footer />
    </div>
  );
}