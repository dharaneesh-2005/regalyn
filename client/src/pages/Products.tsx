import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useTranslation } from "@/contexts/LanguageContext";
import ProductCard from "@/components/ProductCard";
import LogoLoader from "@/components/LogoLoader";
import { Product } from "@shared/schema";
import { useOptimizedPagination } from "@/hooks/useOptimizedData";

export default function Products() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const productsPerPage = 6;
  
  // Use standard API calls with enhanced caching
  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => fetch("/api/products").then(res => res.json()),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
  
  // Fetch products by search if query exists
  const { data: searchResults, isLoading: isSearchLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/search", debouncedQuery],
    queryFn: () => fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}`).then(res => res.json()),
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes cache for search
  });
  
  // Set page title
  useEffect(() => {
    document.title = `${t('products')} - Regalyn`;
  }, [t]);
  
  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        setDebouncedQuery(searchQuery);
      } else {
        setDebouncedQuery("");
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  // Filter and sort products
  const filteredProducts = (() => {
    let filtered = searchQuery ? searchResults || [] : allProducts || [];
    
    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter(product => {
        const productCategory = product.category?.toLowerCase() || '';
        return productCategory.includes(category.toLowerCase()) || 
               (category === "organic" && productCategory.includes("organic")) ||
               (category === "mixed" && productCategory.includes("mix")) ||
               (category === "specialty" && (productCategory.includes("special") || product.featured));
      });
    }
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-desc":
          return parseFloat(b.price) - parseFloat(a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        default: // "featured"
          return a.featured === b.featured ? 0 : a.featured ? -1 : 1;
      }
    });
  })();
  
  // Use optimized pagination
  const pagination = useOptimizedPagination(filteredProducts, productsPerPage);
  const { currentItems: currentProducts, currentPage, totalPages, goToPage, goToNext, goToPrevious, hasNext, hasPrevious } = pagination;
  
  // Generate pagination buttons using optimized pagination
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => goToPage(i)}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === i
            ? "bg-green-600 text-white"
            : "bg-white text-gray-800 hover:bg-gray-100"
        }`}
      >
        {i}
      </button>
    );
  }
  
  // The optimized pagination handles page resets automatically
  
  return (
    <>
      {/* Modern Products Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Modern background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/5"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 360, 0],
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute -bottom-32 -left-32 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-primary/8 to-primary/3 border border-primary/3"
            animate={{ 
              scale: [1, 1.08, 1],
              rotate: [360, 0, 360],
            }}
            transition={{ 
              duration: 40, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        {/* Luxury floating elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 2 === 0 ? 'bg-primary/20' : 'bg-primary/15'
            }`}
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 80}%`,
            }}
            animate={{
              y: [0, Math.random() * -40 - 10, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, Math.random() * 0.3 + 1, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              delay: Math.random() * 8,
            }}
          />
        ))}
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium border border-primary/20">
                Premium Collection • Swiss Heritage
              </span>
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Luxury Collection
              </span>
            </motion.h1>
            <motion.p 
              className="text-muted-foreground text-xl max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Discover our exquisite range of premium Swiss timepieces, each crafted with uncompromising attention to detail
            </motion.p>
          </motion.div>
          
          {/* Breadcrumb */}
          <motion.div 
            className="flex items-center space-x-2 mt-4 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/" className="hover:text-yellow-400 transition-colors">
              <motion.span whileHover={{ x: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                {t('home')}
              </motion.span>
            </Link>
            <span>/</span>
            <span className="text-yellow-400 font-medium">{t('products')}</span>
          </motion.div>
        </div>
      </section>
      
      {/* Filter Section */}
      <section className="py-10 bg-gray-900 border-b border-yellow-400/20 shadow-xl relative z-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="bg-black/60 backdrop-blur-sm rounded-xl shadow-2xl p-6 mb-6 border border-yellow-400/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-grow">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-yellow-400/70"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Search for luxury timepieces..."
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border-yellow-400/30 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="bg-yellow-400/10 px-3 py-2 rounded-lg flex items-center gap-2 border border-yellow-400/20">
                <i className="fas fa-filter text-yellow-400"></i>
                <span className="text-sm text-yellow-400 font-medium">Filters:</span>
              </div>
            </div>
          </motion.div>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">{t('filterBy')}:</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-black/60 border border-yellow-400/30 rounded-full px-4 py-2 text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
                >
                  <option value="all">{t('allCategories')}</option>
                  <option value="organic">{t('organic')}</option>
                  <option value="mixed">{t('mixed')}</option>
                  <option value="specialty">{t('specialty')}</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">{t('sortBy')}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-black/60 border border-yellow-400/30 rounded-full px-4 py-2 text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
                >
                  <option value="featured">{t('featured')}</option>
                  <option value="price-asc">{t('priceLowToHigh')}</option>
                  <option value="price-desc">{t('priceHighToLow')}</option>
                  <option value="name-asc">{t('nameAToZ')}</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">{t('view')}:</span>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid" ? "text-yellow-400 bg-yellow-400/10" : "text-gray-400"
                } hover:bg-yellow-400/20 hover:text-yellow-400 rounded-lg transition-colors border border-yellow-400/20`}
                aria-label="Grid view"
              >
                <i className="fas fa-th-large text-lg"></i>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list" ? "text-yellow-400 bg-yellow-400/10" : "text-gray-400"
                } hover:bg-yellow-400/20 hover:text-yellow-400 rounded-lg transition-colors border border-yellow-400/20`}
                aria-label="List view"
              >
                <i className="fas fa-list text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-12 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-6">
          {isLoading || isSearchLoading ? (
            <div className="flex justify-center py-12">
              <LogoLoader size="large" text="Loading products..." />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
              {currentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20">
                <i className="fas fa-search text-yellow-400/50 text-4xl mb-4"></i>
                <p className="text-gray-300 text-lg">No products found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            </div>
          )}
          
          {/* Results Count */}
          {filteredProducts.length > 0 && (
            <div className="mt-8 text-center text-gray-300">
              {t('showing')} {(currentPage - 1) * productsPerPage + 1}-
              {Math.min(currentPage * productsPerPage, filteredProducts.length)} {t('of')}{" "}
              {filteredProducts.length} {t('products')}
            </div>
          )}
          
          {/* Pagination */}
          {filteredProducts.length > productsPerPage && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={goToPrevious}
                  disabled={!hasPrevious}
                  className="px-4 py-2 bg-black/60 text-yellow-400 rounded-lg border border-yellow-400/30 hover:bg-yellow-400/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {paginationButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index + 1)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      currentPage === index + 1
                        ? "bg-yellow-400 text-black border-yellow-400"
                        : "bg-black/60 text-gray-300 border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-400"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={goToNext}
                  disabled={!hasNext}
                  className="px-4 py-2 bg-black/60 text-yellow-400 rounded-lg border border-yellow-400/30 hover:bg-yellow-400/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </>
  );
}