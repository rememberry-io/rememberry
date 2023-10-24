import type { AppRouter } from "@backend/routers/_app";
import {
  CreateTRPCProxyClient,
  createTRPCProxyClient,
  httpBatchLink,
} from "@trpc/client";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import {env} from "../../lib/env"

class TRPCProxyClient {
  client: CreateTRPCProxyClient<AppRouter>;
  constructor() {
    this.client = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: env.BACKEND_URL,
        }),
      ],
    });
  }
}

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const tClient = new TRPCProxyClient();
