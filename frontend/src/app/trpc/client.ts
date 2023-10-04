import { CreateTRPCProxyClient, createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from "@backend/routers/_app"

class TRPCClient {
  client: CreateTRPCProxyClient<AppRouter>;
  constructor() {
    this.client = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: 'http://localhost:3050',
        }),
      ],
    });
  }
} 

export default new TRPCClient();
