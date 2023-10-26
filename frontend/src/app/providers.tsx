"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useState } from "react";
import { getBackendUrl, rqTrpc } from "./_trpc/client";

export default function Providers({ children, ...props }: ThemeProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    rqTrpc.createClient({
      links: [
        httpBatchLink({
          url: getBackendUrl(),
        }),
      ],
    }),
  );

  return (
    <rqTrpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider {...props}>{children}</NextThemesProvider>;
      </QueryClientProvider>
    </rqTrpc.Provider>
  );
}
