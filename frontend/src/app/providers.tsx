"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useState } from "react";
import superjson from "superjson";
import { getBackendUrl, rqTrpc } from "../lib/services/trpc/client";

export default function Providers({ children, ...props }: ThemeProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    rqTrpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: getBackendUrl(),
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    }),
  );

  return (
    <rqTrpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider {...props}>{children}</NextThemesProvider>
      </QueryClientProvider>
    </rqTrpc.Provider>
  );
}
