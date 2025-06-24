import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";
import { useOptimizedCart } from "@/contexts/OptimizedCartContext";
import ProductCard from "@/components/ProductCard";
import LogoLoader from "@/components/LogoLoader";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Product, ProductReview } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Zap, 
  Shield, 
  Truck, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  User,
  Calendar,
  ThumbsUp
} from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { addToCart, clearCart } = useOptimizedCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  
  // State for quantity, selected weight and active tab
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState("");
  
  // State for weight-specific prices
  const [weightPrices, setWeightPrices] = useState<Record<string, {price: string, comparePrice?: string}>>({});
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [currentComparePrice, setCurrentComparePrice] = useState<string>("");
  
  // State for review form
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);
  const [reviewName, setReviewName] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  
  // Get session ID from localStorage or create a new one
  const [sessionId, setSessionId] = useState<string>("");
  
  // Fetch product details
  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: [`/api/products/slug/${slug}`],
    queryFn: () => fetch(`/api/products/slug/${slug}`).then(res => res.json()),
    enabled: !!slug,
  });
  
  // State for reviews
  const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
  
  // State for calculated average rating
  const [averageRating, setAverageRating] = useState<number>(0);
  
  // Parse reviews from product data and calculate average rating
  useEffect(() => {
    if (product?.reviews) {
      try {
        const parsedReviews = JSON.parse(product.reviews);
        const validReviews = Array.isArray(parsedReviews) ? parsedReviews : [];
        setProductReviews(validReviews);
        
        // Calculate average rating from reviews
        if (validReviews.length > 0) {
          const totalRating = validReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
          const calculatedAvg = totalRating / validReviews.length;
          setAverageRating(calculatedAvg);
        } else {
          setAverageRating(0);
        }
      } catch (e) {
        console.error("Failed to parse reviews:", e);
        setProductReviews([]);
        setAverageRating(0);
      }
    } else {
      setProductReviews([]);
      setAverageRating(0);
    }
  }, [product]);
  
  useEffect(() => {
    // Get or create session ID
    let existingSessionId = localStorage.getItem('sessionId');
    if (!existingSessionId) {
      existingSessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('sessionId', existingSessionId);
    }
    setSessionId(existingSessionId);
  }, []);
  
  // Check if user has already reviewed this product
  useEffect(() => {
    if (sessionId && productReviews.length > 0) {
      const userReview = productReviews.find(review => review.sessionId === sessionId);
      setHasReviewed(!!userReview);
      
      // Pre-fill form with existing review if the user has already submitted one
      if (userReview) {
        setReviewName(userReview.name || "");
        setReviewRating(userReview.rating || 5);
        setReviewComment(userReview.comment || "");
      }
    }
  }, [sessionId, productReviews]);
  
  // Handle marking a review as helpful
  const markReviewHelpful = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!product) return;
      
      // Find the review and increment helpfulCount
      const updatedReviews = productReviews.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
          : review
      );
      
      // Update local state immediately for better UX
      setProductReviews(updatedReviews);
      
      // Recalculate average rating
      if (updatedReviews.length > 0) {
        const totalRating = updatedReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const calculatedAvg = totalRating / updatedReviews.length;
        setAverageRating(calculatedAvg);
      }
      
      // Send the updated reviews to the server
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reviews: JSON.stringify(updatedReviews),
          reviewCount: updatedReviews.length
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update review: ${response.status}`);
      }
      
      return updatedReviews;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/slug/${slug}`] });
      toast({
        title: "Thank you for your feedback",
        description: "Your vote has been counted.",
      });
    },
    onError: (error) => {
      // Revert local state if there was an error
      if (product?.reviews) {
        try {
          const parsedReviews = JSON.parse(product.reviews);
          const validReviews = Array.isArray(parsedReviews) ? parsedReviews : [];
          setProductReviews(validReviews);
          
          // Recalculate average rating
          if (validReviews.length > 0) {
            const totalRating = validReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            const calculatedAvg = totalRating / validReviews.length;
            setAverageRating(calculatedAvg);
          } else {
            setAverageRating(0);
          }
        } catch (e) {
          console.error("Failed to revert reviews:", e);
          setProductReviews([]);
          setAverageRating(0);
        }
      }
      
      toast({
        title: "Failed to mark review as helpful",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Fetch related products
  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Get related products (same category but different product)
  const relatedProducts = allProducts
    ?.filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);
  
  // Set main image and default weight option when product data is loaded
  useEffect(() => {
    if (product) {
      // Set main image
      if (product.imageUrl) {
        setMainImage(product.imageUrl);
      }
      
      // Set default selected weight to first option
      if (product.weightOptions && product.weightOptions.length > 0) {
        setSelectedWeight(product.weightOptions[0]);
      } else {
        // Fallback to default weight
        setSelectedWeight("500g");
      }
      
      // Parse weight prices if available
      if (product.weightPrices && product.weightPrices !== "") {
        try {
          console.log("Parsing weight prices from:", product.weightPrices);
          const parsedPrices = JSON.parse(product.weightPrices);
          console.log("Successfully parsed weight prices:", parsedPrices);
          
          // Filter the weight prices to only include weights that are in weightOptions
          // This ensures removed weight options don't show up
          const filteredPrices: Record<string, {price: string, comparePrice?: string}> = {};
          if (product.weightOptions && Array.isArray(product.weightOptions)) {
            product.weightOptions.forEach(weight => {
              if (parsedPrices[weight]) {
                // Check if the weight price has the new structure (with price and comparePrice)
                if (typeof parsedPrices[weight] === 'object' && parsedPrices[weight] !== null) {
                  // New structure with price and comparePrice
                  // Handle the case where price might be an object or "[object Object]" string (corrupted)
                  let priceValue = product.price || '0'; // default fallback
                  
                  if (typeof parsedPrices[weight].price === 'object') {
                    console.log(`Found price as object for ${weight}, using product price ${product.price}`);
                    // Use default product price when price is an object
                    priceValue = product.price || '0';
                  } else if (typeof parsedPrices[weight].price === 'string' && 
                             parsedPrices[weight].price.includes('[object Object]')) {
                    console.log(`Found corrupted price string for ${weight}, using product price ${product.price}`);
                    // Use default product price when price is corrupted string
                    priceValue = product.price || '0';
                  } else {
                    // Use the actual weight price
                    priceValue = parsedPrices[weight].price || product.price || '0';
                  }
                    
                  filteredPrices[weight] = {
                    price: priceValue,
                    comparePrice: parsedPrices[weight].comparePrice
                  };
                  
                  console.log(`Processed weight ${weight}, price: ${priceValue}, comparePrice: ${parsedPrices[weight].comparePrice}`);
                } else {
                  // Old structure (string price) or direct value
                  const priceValue = typeof parsedPrices[weight] === 'string' 
                    ? parsedPrices[weight]
                    : parsedPrices[weight]?.toString() || product.price;
                    
                  filteredPrices[weight] = {
                    price: priceValue,
                    comparePrice: product.comparePrice || undefined
                  };
                  
                  console.log(`Processed weight ${weight} with old structure, price: ${priceValue}`);
                }
              }
            });
          }
          
          setWeightPrices(filteredPrices);
          
          // Set initial current price based on default selected weight
          const initialWeight = product.weightOptions && product.weightOptions.length > 0 
            ? product.weightOptions[0] 
            : "500g";
          
          console.log("Initial selected weight:", initialWeight);  
          if (filteredPrices[initialWeight]) {
            console.log("Setting price for weight", initialWeight, "to", filteredPrices[initialWeight].price);
            setCurrentPrice(filteredPrices[initialWeight].price);
            setCurrentComparePrice(filteredPrices[initialWeight].comparePrice || "");
          } else {
            console.log("No specific price for weight", initialWeight, "using default price", product.price);
            setCurrentPrice(product.price);
            setCurrentComparePrice(product.comparePrice || "");
          }
        } catch (e) {
          console.error("Failed to parse weight prices:", e);
          setWeightPrices({});
          setCurrentPrice(product.price);
        }
      } else {
        console.log("No weight prices available, using default price");
        setWeightPrices({});
        setCurrentPrice(product.price);
      }
    }
  }, [product]);
  
  // Handle clicking on gallery thumbnail
  const handleImageClick = (image: string) => {
    setMainImage(image);
  };
  
  // Set page title
  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Regalyn`;
    }
  }, [product]);
  
  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    // Only allow increasing quantity if it's less than the available stock
    if (product && product.stockQuantity && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // Ensure the entered quantity is not more than the available stock
    if (!isNaN(value) && value >= 1) {
      if (product && product.stockQuantity) {
        // Limit to stock quantity
        setQuantity(Math.min(value, product.stockQuantity));
      } else {
        setQuantity(value);
      }
    } else {
      setQuantity(1);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      // Ensure quantity doesn't exceed stock quantity
      const safeQuantity = product.stockQuantity ? Math.min(quantity, product.stockQuantity) : quantity;
      addToCart(product.id, safeQuantity, selectedWeight);
      console.log(`Added to cart: ${product.name} - ${safeQuantity} units of ${selectedWeight} weight`);
    }
  };
  
  // Handle buy now
  const handleBuyNow = async () => {
    if (product) {
      try {
        // Show loading indicator
        setIsLoading(true);
        
        // Ensure quantity doesn't exceed stock quantity
        const safeQuantity = product.stockQuantity ? Math.min(quantity, product.stockQuantity) : quantity;
        
        // First add the product to the cart to ensure it's available during checkout
        await addToCart(product.id, safeQuantity, selectedWeight);
        
        // No need to store in session storage anymore since we're using the cart
        console.log(`Buy now: ${product.name} - ${safeQuantity} units of ${selectedWeight} weight at price ${currentPrice}`);
        
        // Redirect directly to checkout page
        navigate("/checkout");
      } catch (error) {
        console.error("Error processing Buy Now:", error);
        toast({
          title: "Error",
          description: "There was a problem processing your request. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Change main image
  const changeMainImage = (src: string) => {
    setMainImage(src);
  };
  
  // Handle submitting a new review
  const submitReview = useMutation({
    mutationFn: async () => {
      if (!product) return;
      
      // Create a new review object
      const newReview: ProductReview = {
        id: Date.now().toString(), // Create unique ID based on timestamp
        name: reviewName,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        rating: reviewRating,
        comment: reviewComment,
        helpfulCount: 0,
        sessionId: sessionId // Add session ID to track who wrote the review
      };
      
      let updatedReviews: ProductReview[];
      
      // Check if user has already reviewed this product
      if (hasReviewed) {
        // Update the existing review
        updatedReviews = productReviews.map(review => 
          review.sessionId === sessionId ? { ...newReview, id: review.id } : review
        );
      } else {
        // Add the new review to the existing reviews
        updatedReviews = [...productReviews, newReview];
      }
      
      try {
        console.log("Updating product with review data:", {
          reviewCount: updatedReviews.length,
          rating: calculateAverageRating(updatedReviews)
        });
        
        // Send the updated reviews to the server - we need to stringify the reviews array
        // for proper storage in the database
        const response = await fetch(`/api/products/${product.id}`, {
          method: "PATCH", 
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            reviews: JSON.stringify(updatedReviews),
            reviewCount: updatedReviews.length,
            rating: calculateAverageRating(updatedReviews)
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to submit review: ${response.status}`);
        }
        
        console.log("Review submission response:", response);
        
        // Update local state for immediate feedback
        setProductReviews(updatedReviews);
        setHasReviewed(true);
        
        // Recalculate average rating
        if (updatedReviews.length > 0) {
          const calculatedAvg = calculateAverageRating(updatedReviews);
          setAverageRating(calculatedAvg);
        }
        
        return updatedReviews;
      } catch (error) {
        console.error("Error submitting review:", error);
        throw new Error("Failed to submit review. Please try again later.");
      }
    },
    onSuccess: () => {
      // Close the review form
      setIsReviewFormOpen(false);
      
      // Reset form fields
      setReviewName("");
      setReviewRating(5);
      setReviewComment("");
      
      // Invalidate queries to refresh product data
      queryClient.invalidateQueries({ queryKey: [`/api/products/slug/${slug}`] });
      
      // Show success toast
      toast({
        title: hasReviewed ? "Review updated" : "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      // Set active tab to reviews so user can see their review
      setActiveTab("reviews");
    },
    onError: (error) => {
      toast({
        title: "Failed to submit review",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Helper function to calculate average rating
  const calculateAverageRating = (reviews: ProductReview[]): number => {
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return parseFloat((totalRating / reviews.length).toFixed(2));
  };
  
  // Handle review form submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if session ID exists
    if (!sessionId) {
      toast({
        title: "Session error",
        description: "Unable to identify your session. Please refresh the page and try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate form fields
    if (!reviewName.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return;
    }
    
    if (!reviewComment.trim()) {
      toast({
        title: "Review text is required",
        description: "Please enter your review.",
        variant: "destructive"
      });
      return;
    }
    
    // Submit the review
    submitReview.mutate();
  };
  
  // Parse nutrition facts if available
  let nutritionFacts = null;
  if (product?.nutritionFacts) {
    try {
      // Try to parse it as JSON
      nutritionFacts = JSON.parse(product.nutritionFacts);
    } catch (e) {
      // If it's not valid JSON, use it as plain text
      nutritionFacts = { text: product.nutritionFacts };
    }
  }
  
  if (productLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-28 flex justify-center py-12">
        <LogoLoader size="large" text="Loading quantum timepiece details..." />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-28">
        <div className="container mx-auto px-6 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Timepiece not found</h2>
            <p className="mt-4 text-gray-300 mb-8">The precision timepiece you are looking for does not exist in our quantum collection.</p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                Browse Timepieces
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Futuristic Background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.03)_0%,transparent_70%)]"></div>
        </div>

        {/* Breadcrumb */}
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-28 pb-6 relative z-10"
        >
          <div className="container mx-auto px-6">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
                {t('home')}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <Link href="/products" className="text-gray-400 hover:text-primary transition-colors">
                {t('products')}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className="text-primary font-medium">{product.name}</span>
            </div>
          </div>
        </motion.section>
      
      {/* Product Detail */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="py-12 relative z-10"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                  <img 
                    src={mainImage} 
                    alt={product.name} 
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-2xl"
                  />
                  
                  {/* Floating action buttons */}
                  <div className="absolute top-8 right-8 space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <Heart className="w-5 h-5 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-4 gap-3 mt-6"
              >
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  src={product.imageUrl} 
                  alt={`${product.name} - Main`} 
                  className={`w-full h-20 object-cover rounded-xl border-2 cursor-pointer transition-all ${
                    mainImage === product.imageUrl ? 'border-primary shadow-lg shadow-primary/25' : 'border-white/20 hover:border-primary/50'
                  }`}
                  onClick={() => handleImageClick(product.imageUrl)}
                />
                
                {product.imageGallery?.map((img, index) => (
                  <motion.img 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    src={img} 
                    alt={`${product.name} - Image ${index + 1}`} 
                    className={`w-full h-20 object-cover rounded-xl border-2 cursor-pointer transition-all ${
                      mainImage === img ? 'border-primary shadow-lg shadow-primary/25' : 'border-white/20 hover:border-primary/50'
                    }`}
                    onClick={() => handleImageClick(img)}
                  />
                ))}
              </motion.div>
            </motion.div>
            
            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Badges and Rating */}
              <div className="flex flex-wrap items-center gap-4">
                {product.badge && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary text-xs font-semibold px-4 py-2 rounded-full border border-primary/30 backdrop-blur-sm"
                  >
                    <Zap className="w-3 h-3 inline mr-1" />
                    {product.badge}
                  </motion.span>
                )}
                
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + (i * 0.1) }}
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            i < Math.floor(averageRating) 
                              ? 'text-primary fill-primary' 
                              : 'text-gray-600'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">({productReviews.length} reviews)</span>
                </div>
              </div>
              
              {/* Product Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {product.name}
                </span>
              </motion.h1>
              
              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-300 text-lg leading-relaxed"
              >
                {product.shortDescription}
              </motion.p>
              
              {/* Pricing Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-6"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-wrap items-baseline gap-4">
                    <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                      ₹{currentPrice || product.price}
                    </span>
                    {(currentComparePrice || product.comparePrice) && (
                      <span className="text-xl text-gray-500 line-through">
                        ₹{currentComparePrice || product.comparePrice}
                      </span>
                    )}
                  </div>
                  {(currentComparePrice || product.comparePrice) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="inline-flex items-center gap-2 text-green-400 text-sm font-medium bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20 w-fit"
                    >
                      <Zap className="w-4 h-4" />
                      Save {Math.round((1 - (parseFloat(currentPrice || product.price) / parseFloat(currentComparePrice || product.comparePrice))) * 100)}%
                    </motion.div>
                  )}
                </div>
              </motion.div>
              
              {/* Case Size Selection */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Case Size</h3>
                <div className="flex flex-wrap gap-3">
                  {(product.weightOptions && product.weightOptions.length > 0 ? product.weightOptions : ["42mm", "44mm"]).map((size) => (
                    <motion.label 
                      key={size} 
                      className="relative cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <input 
                        type="radio" 
                        name="size" 
                        value={size} 
                        checked={selectedWeight === size}
                        onChange={() => {
                          setSelectedWeight(size);
                          if (weightPrices[size]) {
                            setCurrentPrice(weightPrices[size].price);
                            setCurrentComparePrice(weightPrices[size].comparePrice || "");
                          } else {
                            setCurrentPrice(product.price);
                            setCurrentComparePrice(product.comparePrice || "");
                          }
                        }}
                        className="sr-only peer" 
                      />
                      <span className={`block px-6 py-3 border rounded-2xl font-medium transition-all duration-300 ${
                        selectedWeight === size 
                          ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/25' 
                          : 'bg-white/5 border-white/20 text-gray-300 hover:border-primary/50 hover:bg-white/10'
                      }`}>
                        {size}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
              
              {/* Quantity Selection */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mb-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">Quantity:</h3>
                  <div className="flex items-center bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 text-white hover:bg-primary/20 hover:text-primary focus:outline-none transition-all duration-300"
                      onClick={decreaseQuantity}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1" 
                      max={product.stockQuantity || 999}
                      className="w-16 text-center py-3 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-none" 
                    />
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 text-white hover:bg-primary/20 hover:text-primary focus:outline-none transition-all duration-300"
                      onClick={increaseQuantity}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    product.inStock 
                      ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                      : 'text-red-400 bg-red-400/10 border border-red-400/20'
                  }`}>
                    {product.inStock 
                      ? `In Stock (${product.stockQuantity} items)` 
                      : 'Out of Stock'}
                  </span>
                </div>
              </motion.div>
              
              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-primary to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ShoppingCart className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">Add to Cart</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-white/5 backdrop-blur-xl border border-primary/30 text-primary px-8 py-4 rounded-2xl font-semibold hover:bg-primary/10 hover:border-primary transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Buy Now
                </motion.button>
              </motion.div>
              
              {/* Features */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div 
                    className="flex items-center space-x-3 text-gray-300"
                    whileHover={{ x: 5 }}
                  >
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Quantum Precision Certified</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3 text-gray-300"
                    whileHover={{ x: 5 }}
                  >
                    <Truck className="w-5 h-5 text-primary" />
                    <span>Free quantum shipping</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3 text-gray-300"
                    whileHover={{ x: 5 }}
                  >
                    <RotateCcw className="w-5 h-5 text-primary" />
                    <span>Lifetime warranty</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3 text-gray-300"
                    whileHover={{ x: 5 }}
                  >
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Secure authentication</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      </div>
      
      {/* Product Tabs */}
      <section className="py-12 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-6">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-700 flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium focus:outline-none whitespace-nowrap transition-colors ${
                activeTab === "description"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            >
              {t('description')}
            </button>
            <button
              onClick={() => setActiveTab("nutrition")}
              className={`px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium focus:outline-none whitespace-nowrap transition-colors ${
                activeTab === "nutrition"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("cooking")}
              className={`px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium focus:outline-none whitespace-nowrap transition-colors ${
                activeTab === "cooking"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            >
              Care Guide
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium focus:outline-none whitespace-nowrap transition-colors ${
                activeTab === "reviews"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            >
              {t('reviews')} ({productReviews.length})
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="py-6">
            {/* Description Tab */}
            <div className={`tab-content ${activeTab === "description" ? "active" : ""}`}>
              <div className="space-y-4">
                <p className="text-gray-300">{product.description}</p>
              </div>
            </div>
            
            {/* Specifications Tab */}
            <div className={`tab-content ${activeTab === "nutrition" ? "active" : ""}`}>
              {nutritionFacts ? (
                <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold text-white mb-4">Technical Specifications</h3>
                  
                  {/* If specifications is just plain text */}
                  {nutritionFacts.text ? (
                    <div className="whitespace-pre-line">
                      <p className="text-gray-300">{nutritionFacts.text}</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-400 mb-4">Model: Swiss Precision Collection</p>
                      
                      <div className="border-t border-gray-600 pt-4">
                        <div className="flex justify-between border-b border-gray-600 py-2">
                          <span className="font-medium text-gray-300">Movement</span>
                          <span className="text-yellow-400">Swiss Automatic</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-600 py-2">
                          <span className="font-medium text-gray-300">Case Material</span>
                          <span className="text-yellow-400">Stainless Steel</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-600 py-2 pl-6">
                          <span className="text-gray-300">Case Diameter</span>
                          <span className="text-yellow-400">42mm</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-600 py-2">
                          <span className="font-medium text-gray-300">Water Resistance</span>
                          <span className="text-yellow-400">100m / 330ft</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-600 py-2">
                          <span className="font-medium text-gray-300">Crystal</span>
                          <span className="text-yellow-400">Sapphire</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-600 py-2">
                          <span className="font-medium text-gray-300">Strap Material</span>
                          <span className="text-yellow-400">Genuine Leather</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-600 py-2 pl-6">
                          <span className="text-gray-300">Strap Width</span>
                          <span className="text-yellow-400">20mm</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-600 py-2 pl-6">
                          <span className="text-gray-300">Buckle Type</span>
                          <span className="text-yellow-400">Deployment Clasp</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="font-medium text-gray-300">Power Reserve</span>
                          <span className="text-yellow-400">42 Hours</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium text-white mb-2">Additional Features</h4>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Date Display</span>
                            <span className="text-yellow-400">Yes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Luminous Hands</span>
                            <span className="text-yellow-400">Swiss Super-LumiNova</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Certification</span>
                            <span className="text-yellow-400">COSC Chronometer</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-6">*All specifications are subject to Swiss manufacturing standards and quality control processes.</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Specifications are not available for this timepiece.</p>
                </div>
              )}
            </div>
            
            {/* Care Guide Tab */}
            <div className={`tab-content ${activeTab === "cooking" ? "active" : ""}`}>
              {product.cookingInstructions ? (
                <div className="space-y-6">
                  <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Watch Care Instructions</h3>
                    <p className="text-gray-300">{product.cookingInstructions}</p>
                  </div>
                  
                  <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Maintenance Guidelines</h3>
                    
                    <div className="mb-6">
                      <h4 className="font-medium text-yellow-400 mb-2">Daily Care Instructions</h4>
                      <p className="text-gray-300 mb-3">Proper maintenance ensures your luxury timepiece retains its precision and beauty for generations.</p>
                      <button 
                        className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                        onClick={() => {
                          const careDiv = document.getElementById('daily-care');
                          if (careDiv) {
                            careDiv.classList.toggle('hidden');
                          }
                        }}
                      >
                        View Instructions <i className="fas fa-chevron-down ml-1"></i>
                      </button>
                      <div id="daily-care" className="hidden mt-3 pl-4 border-l-2 border-yellow-400/30">
                        <h5 className="font-medium mb-2 text-white">Daily Maintenance:</h5>
                        <ul className="list-disc pl-5 mb-3 text-gray-300 text-sm">
                          <li>Wind your automatic watch daily if not worn regularly</li>
                          <li>Avoid exposure to strong magnetic fields</li>
                          <li>Keep away from extreme temperatures</li>
                          <li>Wipe with a soft, dry cloth after wearing</li>
                          <li>Store in a watch box when not in use</li>
                          <li>Avoid impact and shock</li>
                          <li>Do not operate crown or pushers underwater</li>
                          <li>Check water resistance annually</li>
                          <li>Professional service every 3-5 years</li>
                        </ul>
                        
                        <h5 className="font-medium mb-2 text-white">Cleaning Process:</h5>
                        <ol className="list-decimal pl-5 text-gray-300 text-sm">
                          <li>Use a soft-bristled brush for the case and bracelet</li>
                          <li>Clean with lukewarm water and mild soap</li>
                          <li>Rinse thoroughly and dry completely</li>
                          <li>Polish with microfiber cloth for optimal shine</li>
                          <li>For leather straps, use specialized leather cleaner</li>
                          <li>Avoid chemicals, perfumes, and cosmetics</li>
                          <li>Professional ultrasonic cleaning recommended</li>
                          <li>Regular inspection of gaskets and seals</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Care instructions are not available for this timepiece.</p>
                </div>
              )}
            </div>
            
            {/* Reviews Tab */}
            <div className={`tab-content ${activeTab === "reviews" ? "active" : ""}`}>
              <div className="space-y-8">
                {/* Review Summary */}
                <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-white">Customer Reviews</h3>
                    <button 
                      className={`${
                        !sessionId ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400'
                      } px-4 py-2 rounded-lg transition-colors text-sm sm:text-base font-medium`}
                      onClick={() => setIsReviewFormOpen(true)}
                      disabled={!sessionId}
                      title={!sessionId ? "Session ID not available" : ""}
                    >
                      {hasReviewed ? "Edit Your Review" : "Write a Review"}
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center mt-4">
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 mr-4 text-center sm:text-left mb-2 sm:mb-0">{averageRating.toFixed(1)}</div>
                    <div>
                      <div className="star-rating text-xl text-center sm:text-left">
                        {[...Array(5)].map((_, i) => {
                          let starClass = 'far fa-star'; // Default empty star
                          
                          if (i < Math.floor(averageRating)) {
                            starClass = 'fas fa-star'; // Full star
                          } else if (i < Math.ceil(averageRating) && i >= Math.floor(averageRating)) {
                            starClass = 'fas fa-star-half-alt'; // Half star
                          }
                          
                          return <i key={i} className={starClass}></i>;
                        })}
                      </div>
                      <p className="text-gray-600 mt-1 text-center sm:text-left">Based on {productReviews.length} reviews</p>
                    </div>
                  </div>
                  
                  {productReviews.length > 0 && (
                    <div className="mt-6 space-y-2">
                      {[5, 4, 3, 2, 1].map(rating => {
                        // Count reviews for this rating
                        const ratingCount = productReviews.filter(r => Math.round(r.rating) === rating).length;
                        const percentage = productReviews.length > 0 
                          ? Math.round((ratingCount / productReviews.length) * 100) 
                          : 0;
                          
                        return (
                          <div key={rating} className="flex items-center">
                            <span className="text-xs w-8">{rating} ★</span>
                            <div className="w-full bg-gray-200 h-2 ml-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs w-8 ml-2">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Individual Reviews */}
                <div className="space-y-6">
                  {productReviews.length > 0 ? (
                    <>
                      {productReviews.map((review) => (
                        <div key={review.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800">{review.name}</h4>
                              <div className="flex items-center mt-1">
                                <div className="star-rating text-sm">
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className={i < review.rating ? 'fas fa-star' : 'far fa-star'}></i>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-2">Verified Purchase</span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 mt-1 sm:mt-0">{review.date}</span>
                          </div>
                          <p className="mt-3 text-gray-700">{review.comment}</p>
                          <div className="flex mt-4">
                            <button 
                              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                              onClick={() => markReviewHelpful.mutate(review.id)}
                              disabled={markReviewHelpful.isPending}
                            >
                              <i className="far fa-thumbs-up mr-1"></i> 
                              Helpful ({review.helpfulCount || 0})
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* More Reviews Button */}
                      {productReviews.length > 2 && (
                        <div className="text-center">
                          <button className="text-green-600 hover:text-green-700 font-medium flex items-center justify-center mx-auto">
                            Load More Reviews <i className="fas fa-chevron-down ml-2"></i>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                      <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Review Form Modal */}
      {isReviewFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {hasReviewed ? "Edit Your Review" : "Write a Review"}
                </h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setIsReviewFormOpen(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label htmlFor="reviewName" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="reviewName"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex items-center space-x-2 sm:space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setReviewRating(rating)}
                          className="text-2xl focus:outline-none p-1 sm:p-0"
                        >
                          <i 
                            className={rating <= reviewRating ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300'} 
                            aria-hidden="true"
                          ></i>
                        </button>
                      ))}
                    </div>
                    <span className="mt-2 sm:mt-0 sm:ml-2 text-sm text-gray-600">
                      {reviewRating} out of 5 stars
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    id="reviewComment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Write your review here..."
                    required
                  ></textarea>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsReviewFormOpen(false)}
                    className="order-2 sm:order-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitReview.isPending}
                    className="order-1 sm:order-2 px-4 py-3 sm:py-2 bg-green-700 text-white rounded-md hover:bg-green-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-1/4 w-32 h-32 border border-yellow-400/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-40 left-1/3 w-48 h-48 border border-amber-400/20 rounded-full animate-pulse delay-1000"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-medium px-4 py-1 rounded-full mb-3">
                Curated Collection
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                You May Also <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Appreciate</span>
              </h2>
              <p className="text-gray-300 md:text-lg max-w-2xl mx-auto">
                Discover other exceptional timepieces from our Swiss precision collection
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="transform transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
