import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../routers/_app";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3050",
    }),
  ],
});

client.user.createUser.query({
  username: "test",
  email: "test@gmail",
  password: "dongS",
});
