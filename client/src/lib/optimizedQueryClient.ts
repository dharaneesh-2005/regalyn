import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Optimized Query Client with aggressive caching and batch operations
 * Reduces API calls by implementing smart caching strategies
 */

// Enhanced cache durations for different data types
const CACHE_DURATIONS = {
  PRODUCTS: 30 * 60 * 1000, // 30 minutes - products change infrequently
  CART: 5 * 60 * 1000, // 5 minutes - cart can change more often
  SETTINGS: 60 * 60 * 1000, // 1 hour - settings rarely change
  ORDERS: 10 * 60 * 1000, // 10 minutes - orders update occasionally
} as const;

// In-memory cache for immediate access to frequently used data
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number) {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(pattern?: string) {
    if (pattern) {
      const keys = Array.from(this.cache.keys());
      keys.forEach(key => {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      });
    } else {
      this.cache.clear();
    }
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    return Date.now() - item.timestamp <= item.ttl;
  }
}

export const memoryCache = new MemoryCache();

/**
 * Enhanced error handling with retry logic
 */
export async function throwIfResNotOk(res: Response): Promise<void> {
  // 304 Not Modified is a valid response for cached content
  if (!res.ok && res.status !== 304) {
    let message = `HTTP Error ${res.status}`;
    let error = undefined;

    try {
      const json = await res.json();
      if (json.message) {
        message = json.message;
      } else if (json.error) {
        message = json.error;
      }
      error = json;
    } catch (_) {
      try {
        message = await res.text();
      } catch (_) {
        // Use default message
      }
    }

    const httpError = new Error(message);
    (httpError as any).status = res.status;
    (httpError as any).error = error;
    throw httpError;
  }
}

/**
 * Batch API request helper - combines multiple requests into one
 */
export const batchApiRequest = async (requests: Array<{ method: string; url: string; data?: any }>) => {
  try {
    const responses = await Promise.all(
      requests.map(async ({ method, url, data }) => {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        const options: RequestInit = {
          method,
          headers,
          credentials: "include",
        };

        if (data) {
          options.body = JSON.stringify(data);
        }

        const res = await fetch(url, options);
        await throwIfResNotOk(res);
        return res.json();
      })
    );

    return responses;
  } catch (error) {
    console.error("Batch request failed:", error);
    throw error;
  }
};

/**
 * Enhanced API request with intelligent caching
 */
export const optimizedApiRequest = async (method: string, url: string, data?: any) => {
  const cacheKey = `${method}:${url}${data ? ':' + JSON.stringify(data) : ''}`;
  
  // Check memory cache first for GET requests
  if (method.toUpperCase() === 'GET') {
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      return { json: () => Promise.resolve(cached) };
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  // Add session ID for cart operations - ensure consistency
  let sessionId = localStorage.getItem('cartSessionId');
  if (!sessionId) {
    // Generate a new session ID if none exists
    sessionId = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('cartSessionId', sessionId);
  }
  headers['Session-Id'] = sessionId;
  
  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const res = await fetch(url, options);
  await throwIfResNotOk(res);

  // Handle JSON responses appropriately
  if (res.ok || res.status === 304) {
    try {
      // For 304 responses, try cached data first
      if (res.status === 304) {
        const cached = memoryCache.get(cacheKey);
        if (cached) {
          return { json: () => Promise.resolve(cached) };
        }
      }
      
      // Try to parse JSON response
      const responseData = await res.json();
      
      // Cache successful responses
      if (method.toUpperCase() === 'GET') {
        let ttl = CACHE_DURATIONS.PRODUCTS; // default
        if (url.includes('/cart')) ttl = CACHE_DURATIONS.CART;
        else if (url.includes('/settings')) ttl = CACHE_DURATIONS.SETTINGS;
        else if (url.includes('/orders')) ttl = CACHE_DURATIONS.ORDERS;
        
        memoryCache.set(cacheKey, responseData, ttl);
      }
      
      return { json: () => Promise.resolve(responseData) };
    } catch (jsonError) {
      // If JSON parsing fails, return empty object for GET requests, 
      // or return the raw response for other methods
      if (method.toUpperCase() === 'GET') {
        return { json: () => Promise.resolve([]) };
      }
      return res;
    }
  }

  return res;
};

/**
 * Optimized query function with memory cache integration
 */
export const getOptimizedQueryFn: <T>(options: {
  on401: "returnNull" | "throw";
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const cacheKey = `GET:${url}`;
    
    // Check memory cache first
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const headers: Record<string, string> = {
        'Cache-Control': 'max-age=1800, stale-while-revalidate=300',
        'If-None-Match': '*',
      };

      const res = await fetch(url, {
        credentials: "include",
        headers,
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      
      // Cache the response
      let ttl = CACHE_DURATIONS.PRODUCTS;
      if (url.includes('/cart')) ttl = CACHE_DURATIONS.CART;
      else if (url.includes('/settings')) ttl = CACHE_DURATIONS.SETTINGS;
      else if (url.includes('/orders')) ttl = CACHE_DURATIONS.ORDERS;
      
      memoryCache.set(cacheKey, data, ttl);
      
      return data;
    } catch (error) {
      if (unauthorizedBehavior === "returnNull") {
        return null;
      }
      throw error;
    }
  };

/**
 * Optimized Query Client with enhanced caching strategies
 */
export const optimizedQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getOptimizedQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: CACHE_DURATIONS.PRODUCTS, // 30 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 408, 429
        if (error?.status >= 400 && error?.status < 500) {
          return error?.status === 408 || error?.status === 429;
        }
        return failureCount < 2;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnReconnect: 'always',
      gcTime: 60 * 60 * 1000, // 1 hour garbage collection
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      onSuccess: () => {
        // Clear relevant cache entries on successful mutations
        memoryCache.clear('cart');
        memoryCache.clear('order');
      },
    },
  },
});

/**
 * Utility to prefetch and cache related data
 */
export const prefetchRelatedData = async (productIds: number[]) => {
  if (productIds.length === 0) return;
  
  // Batch prefetch products that aren't in cache
  const uncachedIds = productIds.filter(id => !memoryCache.has(`GET:/api/products/${id}`));
  
  if (uncachedIds.length > 0) {
    try {
      // Use batch request to get multiple products at once
      const requests = uncachedIds.map(id => ({
        method: 'GET',
        url: `/api/products/${id}`,
      }));
      
      const responses = await batchApiRequest(requests);
      
      // Cache the responses
      responses.forEach((data, index) => {
        const productId = uncachedIds[index];
        memoryCache.set(`GET:/api/products/${productId}`, data, CACHE_DURATIONS.PRODUCTS);
      });
    } catch (error) {
      console.warn('Failed to prefetch product data:', error);
    }
  }
};

/**
 * Background sync utility - periodically sync important data
 */
export const startBackgroundSync = () => {
  // Sync cart data every 2 minutes in background
  setInterval(() => {
    optimizedQueryClient.invalidateQueries({ queryKey: ['/api/cart'] });
  }, 2 * 60 * 1000);
  
  // Sync product data every 15 minutes in background
  setInterval(() => {
    memoryCache.clear('products');
    optimizedQueryClient.invalidateQueries({ queryKey: ['/api/products'] });
  }, 15 * 60 * 1000);
};

/**
 * Cache warming utility - preload critical data
 */
export const warmCache = async () => {
  try {
    // Preload critical data that's likely to be needed
    const criticalQueries = [
      '/api/products/featured',
      '/api/products',
      '/api/cart',
    ];
    
    await Promise.allSettled(
      criticalQueries.map(queryKey => 
        optimizedQueryClient.prefetchQuery({ queryKey: [queryKey] })
      )
    );
  } catch (error) {
    console.warn('Cache warming failed:', error);
  }
};