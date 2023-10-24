import type { AppRouter } from "@backend/routers/_app";
import {
  CreateTRPCProxyClient,
  createTRPCProxyClient,
  httpBatchLink,
} from "@trpc/client";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { env } from "../../lib/env";

class TRPCProxyClient {
  client: CreateTRPCProxyClient<AppRouter>;
  url: string;
  constructor() {
    if (env.NEXT_PUBLIC_IS_DEV) {
      this.url = "http://" + env.NEXT_PUBLIC_BACKEND_HOST + ":" + env.NEXT_PUBLIC_BACKEND_PORT;
    } else {
        this.url = "https://" + env.NEXT_PUBLIC_BACKEND_HOST
    }

    console.log(this.url)

    this.client = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: this.url,
        }),
      ],
    });
  }
}

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const tClient = new TRPCProxyClient();
