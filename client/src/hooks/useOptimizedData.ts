import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Product, CartItem } from '@shared/schema';
import { dataService } from '@/lib/dataService';
import { optimizedQueryClient } from '@/lib/optimizedQueryClient';

/**
 * Optimized data hooks that significantly reduce API calls through intelligent caching
 */

// Custom hook for products with advanced caching
export function useOptimizedProducts(category?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await dataService.getProducts(category);
        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        // Fallback to direct API call if data service fails
        try {
          const response = await fetch('/api/products');
          const fallbackData = await response.json();
          if (isMounted) {
            setProducts(fallbackData);
          }
        } catch (fallbackError) {
          console.error('Fallback API call also failed:', fallbackError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [category]);

  return { data: products, isLoading };
}

// Hook for featured products from cache
export function useOptimizedFeaturedProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadFeaturedProducts = async () => {
      setIsLoading(true);
      try {
        const data = await dataService.getFeaturedProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to load featured products:', error);
        // Fallback to direct API call
        try {
          const response = await fetch('/api/products/featured');
          const fallbackData = await response.json();
          if (isMounted) {
            setProducts(fallbackData);
          }
        } catch (fallbackError) {
          console.error('Fallback featured products API call failed:', fallbackError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data: products, isLoading };
}

// Hook for single product with caching
export function useOptimizedProduct(id: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const data = await dataService.getProduct(id);
        if (isMounted) {
          setProduct(data);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      loadProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data: product, isLoading };
}

// Hook for search with local-first approach
export function useOptimizedSearch(query: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;

    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await dataService.searchProducts(query);
        if (isMounted) {
          setResults(data);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(performSearch, 300); // Debounce search

    return () => {
      clearTimeout(timeoutId);
      isMounted = false;
    };
  }, [query]);

  return { data: results, isLoading };
}

// Hook for categories from cache
export function useOptimizedCategories() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    dataService.getCategories().then(setCategories);
  }, []);

  return categories;
}

// Enhanced cart hook that works with optimized cart context
export function useOptimizedCartData() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await dataService.getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      // Calculate total using cached product data
      return total + (parseFloat('0') * item.quantity); // Will be enhanced with product pricing
    }, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    isLoading,
    cartTotal,
    cartCount,
    refreshCart,
  };
}

// Hook for batch data loading - loads all essential data in one go
export function useAppDataLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appData, setAppData] = useState<any>(null);

  useEffect(() => {
    const loadAppData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await dataService.loadAppData();
        setAppData(data);
      } catch (err) {
        console.error('Failed to load app data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadAppData();
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dataService.refresh();
      setAppData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    appData,
    refresh,
  };
}

// Hook for optimized pagination
export function useOptimizedPagination<T>(
  items: T[],
  itemsPerPage: number = 12
) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToNext = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPrevious = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Reset to page 1 when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  return {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    goToNext,
    goToPrevious,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
  };
}

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    apiCalls: 0,
    cacheHits: 0,
    loadTime: 0,
  });

  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      setMetrics(prev => ({
        ...prev,
        loadTime: endTime - startTime,
      }));
    };
  }, []);

  return metrics;
}

// Legacy compatibility hooks for gradual migration
export function useLegacyQuery<T>(queryKey: string[]) {
  console.warn(`Legacy query used: ${queryKey.join('/')}. Consider migrating to optimized hooks.`);
  return useQuery<T>({ queryKey });
}

// Preloader hook for critical data
export function useDataPreloader() {
  useEffect(() => {
    // Preload critical data on app start
    dataService.loadAppData().catch(console.error);
  }, []);
}

// Hook for real-time cache status
export function useCacheStatus() {
  const [status, setStatus] = useState({
    size: 0,
    hits: 0,
    misses: 0,
  });

  useEffect(() => {
    // Monitor cache performance
    const interval = setInterval(() => {
      const cachedData = dataService.getCachedData();
      setStatus({
        size: Object.keys(cachedData).length,
        hits: 0, // Will be implemented with proper metrics
        misses: 0,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return status;
}