import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from "./routes/AppRoutes";

// 1. Initialize the Query Client with enterprise-level default settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents excessive API calls when users switch browser tabs
      retry: 1,                    // Only retry failed requests once to avoid spamming your backend
      staleTime: 5 * 60 * 1000,    // Keeps data fresh in cache for 5 minutes
    },
  },
});

function App() {
  return (
    // 2. Wrap your entire application inside the Provider
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

export default App;