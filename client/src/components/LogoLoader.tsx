import { motion } from "framer-motion";
import logoPath from "@assets/LOGO-removebg-preview.png";

interface LogoLoaderProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

export default function LogoLoader({ size = "medium", text }: LogoLoaderProps) {
  const sizeClasses = {
    small: "h-12 w-12",
    medium: "h-20 w-20",
    large: "h-32 w-32",
  };

  const ringSize = {
    small: "h-16 w-16",
    medium: "h-24 w-24", 
    large: "h-40 w-40",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Quantum Loading Rings */}
        <motion.div
          className={`absolute inset-0 ${ringSize[size]} border-2 border-primary/30 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, rgba(168, 85, 247, 0.6) 90deg, transparent 180deg)"
          }}
        />
        
        <motion.div
          className={`absolute inset-0 ${ringSize[size]} border-2 border-purple-500/40 rounded-full`}
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          style={{
            background: "conic-gradient(from 180deg, transparent 0deg, rgba(147, 51, 234, 0.5) 120deg, transparent 240deg)"
          }}
        />

        <motion.div
          className={`absolute inset-0 ${ringSize[size]} border border-blue-400/30 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            background: "conic-gradient(from 90deg, transparent 0deg, rgba(99, 102, 241, 0.4) 60deg, transparent 120deg)"
          }}
        />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: size === "large" ? "80px" : size === "medium" ? "50px" : "32px",
            }}
            animate={{
              rotate: 360,
              scale: [0.5, 1.2, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              rotate: { duration: 2 + i * 0.3, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5 + i * 0.2, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1.8 + i * 0.1, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}

        {/* Central Logo with Advanced Effects */}
        <motion.div
          className={`relative ${sizeClasses[size]} flex items-center justify-center`}
          style={{ zIndex: 10 }}
        >
          {/* Holographic Backdrop */}
          <motion.div
            className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
            animate={{
              boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)"
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Pulsing glow effect */}
          <motion.div
            className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 opacity-50"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Logo with Quantum Effects */}
          <motion.div
            animate={{ 
              y: [0, -4, 0],
              rotateY: [0, 5, -5, 0],
            }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative z-20"
          >
            <img 
              src={logoPath} 
              alt="Loading" 
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
            
            {/* Energy Pulse Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl"
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Quantum Field Effect */}
        <motion.div
          className={`absolute inset-0 ${ringSize[size]} opacity-30`}
          animate={{
            background: [
              "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Modern Loading Text */}
      {text && (
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p 
            className="text-white font-medium bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent"
            animate={{ 
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {text}
          </motion.p>
          
          {/* Animated Dots */}
          <motion.div className="flex justify-center space-x-1 mt-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}