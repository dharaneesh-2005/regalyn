import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import { insertContactSchema } from "@shared/schema";
import { useTranslation } from "@/contexts/LanguageContext";
import * as Select from "@radix-ui/react-select";

export default function Contact() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(insertContactSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Futuristic Hero Section */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        {/* Advanced background system */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 360, 0],
              x: [0, 80, 0],
              y: [0, -60, 0],
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-purple-500/15 to-pink-500/15 blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 0, 360],
              x: [0, -70, 0],
              y: [0, 50, 0],
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-primary/12 to-purple-500/12 blur-2xl"
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ 
              duration: 18, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary px-8 py-4 rounded-full text-sm font-medium border border-primary/30 backdrop-blur-sm mb-8"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(168, 85, 247, 0.3)",
                    "0 0 40px rgba(168, 85, 247, 0.5)",
                    "0 0 20px rgba(168, 85, 247, 0.3)"
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <span>🚀 Connect with the Future</span>
              </motion.span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.9]"
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
                Let's
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
                Connect
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300/80 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Ready to explore the future of timepieces? Whether you're seeking quantum precision, 
              custom designs, or have questions about our revolutionary technology, 
              our team of chronometry experts is here to guide your journey.
            </motion.p>
            
            {/* Floating contact methods */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {[
                { icon: "💬", text: "Live Chat", desc: "Instant Support" },
                { icon: "📧", text: "Email", desc: "24h Response" },
                { icon: "📞", text: "Call", desc: "Expert Consultation" }
              ].map((method, index) => (
                <motion.div
                  key={method.text}
                  className="bg-gradient-to-r from-primary/10 to-purple-500/10 px-6 py-4 rounded-2xl border border-primary/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -5 }}
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    y: {
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <div className="text-primary font-semibold">{method.text}</div>
                  <div className="text-gray-400 text-sm">{method.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Futuristic Contact Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">
            {/* Enhanced Contact Information */}
            <motion.div 
              className="lg:col-span-5 space-y-12"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <div>
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-white mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    Future
                  </span>{" "}
                  Communication
                </motion.h2>
                <motion.p 
                  className="text-gray-300/80 leading-relaxed text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  Connect with our quantum chronometry specialists through advanced communication channels. 
                  Experience next-generation customer service with instant holographic consultations.
                </motion.p>
              </div>

              <div className="space-y-8">
                <motion.div 
                  className="group relative p-8 bg-gradient-to-br from-gray-900/40 to-purple-900/20 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-primary/40 transition-all duration-700 overflow-hidden"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 40px -10px rgba(168, 85, 247, 0.3)" 
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  <div className="relative z-10 flex items-start space-x-6">
                    <motion.div 
                      className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-2xl flex items-center justify-center border border-primary/40"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                    >
                      <Mail className="w-8 h-8 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-500">
                        Quantum Email
                      </h3>
                      <p className="text-gray-300/80 text-sm mb-3">Instant neural-link messaging</p>
                      <a 
                        href="mailto:future@regalyn.tech" 
                        className="text-primary hover:text-purple-400 transition-colors text-lg font-medium"
                      >
                        future@regalyn.tech
                      </a>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="group relative p-8 bg-gradient-to-br from-gray-900/40 to-purple-900/20 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-primary/40 transition-all duration-700 overflow-hidden"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 40px -10px rgba(168, 85, 247, 0.3)" 
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  <div className="relative z-10 flex items-start space-x-6">
                    <motion.div 
                      className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-2xl flex items-center justify-center border border-primary/40"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                    >
                      <Phone className="w-8 h-8 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-500">
                        Holographic Call
                      </h3>
                      <p className="text-gray-300/80 text-sm mb-3">3D reality consultation</p>
                      <a 
                        href="tel:+15555551234" 
                        className="text-primary hover:text-purple-400 transition-colors text-lg font-medium"
                      >
                        +1 (555) FUTURE-1
                      </a>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="group relative p-8 bg-gradient-to-br from-gray-900/40 to-purple-900/20 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-primary/40 transition-all duration-700 overflow-hidden"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 40px -10px rgba(168, 85, 247, 0.3)" 
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  <div className="relative z-10 flex items-start space-x-6">
                    <motion.div 
                      className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-2xl flex items-center justify-center border border-primary/40"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                    >
                      <MapPin className="w-8 h-8 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-500">
                        Portal Location
                      </h3>
                      <p className="text-gray-300/80 text-sm mb-3">Quantum showroom access</p>
                      <address className="text-primary not-italic text-lg font-medium">
                        Neo Tokyo District<br />
                        Quantum City 2077
                      </address>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Futuristic Contact Form */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <motion.div 
                className="relative bg-gradient-to-br from-gray-900/40 to-purple-900/20 backdrop-blur-xl rounded-3xl border border-white/10 p-10 overflow-hidden"
                whileHover={{ 
                  boxShadow: "0 30px 60px -12px rgba(168, 85, 247, 0.2)" 
                }}
              >
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <div className="relative z-10">
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold text-white mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      Quantum
                    </span>{" "}
                    Transmission
                  </motion.h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                    >
                      <label className="block text-gray-300 mb-3 font-medium" htmlFor="name">
                        Neural ID
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        className={`w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Enter your name"
                        {...register("name")}
                      />
                      {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name.message as string}</p>}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                    >
                      <label className="block text-gray-300 mb-3 font-medium" htmlFor="email">
                        Quantum Address
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        className={`w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter your email"
                        {...register("email")}
                      />
                      {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message as string}</p>}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.6 }}
                    >
                      <label className="block text-gray-300 mb-3 font-medium" htmlFor="phone">
                        Neural Link Code
                      </label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className={`w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="Enter your phone"
                        {...register("phone")}
                      />
                      {errors.phone && <p className="mt-2 text-sm text-red-400">{errors.phone.message as string}</p>}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 0.6 }}
                    >
                      <label className="block text-gray-300 mb-3 font-medium" htmlFor="subject">
                        Transmission Type
                      </label>
                      <Select.Root
                        value={selectedSubject}
                        onValueChange={(value) => {
                          setSelectedSubject(value);
                          setValue("subject", value);
                        }}
                      >
                        <Select.Trigger
                          className={`w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:bg-white/10 text-white backdrop-blur-sm transition-all duration-300 flex items-center justify-between ${errors.subject ? 'border-red-500' : ''}`}
                        >
                          <Select.Value placeholder="Select transmission type" />
                          <Select.Icon>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </Select.Icon>
                        </Select.Trigger>
                        
                        <Select.Portal>
                          <Select.Content className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                            <Select.Viewport className="p-2">
                              <Select.Item value="general" className="px-4 py-3 text-white hover:bg-primary/20 rounded-xl cursor-pointer transition-colors outline-none">
                                <Select.ItemText>General Inquiry</Select.ItemText>
                              </Select.Item>
                              <Select.Item value="support" className="px-4 py-3 text-white hover:bg-primary/20 rounded-xl cursor-pointer transition-colors outline-none">
                                <Select.ItemText>Quantum Support</Select.ItemText>
                              </Select.Item>
                              <Select.Item value="wholesale" className="px-4 py-3 text-white hover:bg-primary/20 rounded-xl cursor-pointer transition-colors outline-none">
                                <Select.ItemText>Commercial Inquiry</Select.ItemText>
                              </Select.Item>
                              <Select.Item value="feedback" className="px-4 py-3 text-white hover:bg-primary/20 rounded-xl cursor-pointer transition-colors outline-none">
                                <Select.ItemText>Neural Feedback</Select.ItemText>
                              </Select.Item>
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                      {errors.subject && <p className="mt-2 text-sm text-red-400">{errors.subject.message as string}</p>}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6, duration: 0.6 }}
                    >
                      <label className="block text-gray-300 mb-3 font-medium" htmlFor="message">
                        Neural Message
                      </label>
                      <textarea 
                        id="message" 
                        rows={6} 
                        className={`w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 resize-none ${errors.message ? 'border-red-500' : ''}`}
                        placeholder="Enter your message..."
                        {...register("message")}
                      />
                      {errors.message && <p className="mt-2 text-sm text-red-400">{errors.message.message as string}</p>}
                    </motion.div>

                    <motion.button 
                      type="submit" 
                      className="group relative w-full bg-gradient-to-r from-primary to-purple-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-500 overflow-hidden disabled:opacity-50"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.7, duration: 0.6 }}
                    >
                      {/* Animated background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      
                      <span className="relative z-10">
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <motion.div
                              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Transmitting...
                          </div>
                        ) : (
                          "Send Quantum Message"
                        )}
                      </span>
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}