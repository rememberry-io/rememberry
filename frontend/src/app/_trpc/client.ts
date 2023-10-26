import type { AppRouter } from "@backend/routers/_app";
import {
  CreateTRPCProxyClient,
  createTRPCProxyClient,
  httpBatchLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { env } from "../../lib/env";

export const getBackendUrl = () => {
  if (env.NEXT_PUBLIC_IS_DEV) {
    return (
      "http://" +
      env.NEXT_PUBLIC_BACKEND_HOST +
      ":" +
      env.NEXT_PUBLIC_BACKEND_PORT
    );
  } else {
    return "https://" + env.NEXT_PUBLIC_BACKEND_HOST;
  }
};

export const rqTrpc = createTRPCReact<AppRouter>();

export class TRPCClientProvider {
  client: CreateTRPCProxyClient<AppRouter>;
  url: string;
  constructor() {
    this.url = getBackendUrl();
    const clientOpts = {
      links: [
        httpBatchLink({
          url: this.url,
        }),
      ],
    };
    this.client = createTRPCProxyClient<AppRouter>(
      clientOpts,
    ) as CreateTRPCProxyClient<AppRouter>;
  }
}

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export const proxyClient = new TRPCClientProvider();
