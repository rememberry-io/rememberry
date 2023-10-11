import {
  CreateTRPCProxyClient,
  createTRPCProxyClient,
  httpBatchLink,
} from "@trpc/client";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@backend/routers/_app";
import { CreateTRPCReact, createTRPCReact } from "@trpc/react-query";

class TRPCProxyClient {
  client: CreateTRPCProxyClient<AppRouter>;
  constructor() {
    this.client = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "http://localhost:3050",
        }),
      ],
    });
  }
}

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const tClient = new TRPCProxyClient();
