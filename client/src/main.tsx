import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { optimizedQueryClient, warmCache, startBackgroundSync } from "./lib/optimizedQueryClient";

// Initialize performance optimizations
warmCache();
startBackgroundSync();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={optimizedQueryClient}>
    <App />
  </QueryClientProvider>
);
