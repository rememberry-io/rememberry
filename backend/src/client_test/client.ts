import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../routers/_app";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3050",
    }),
  ],
});

const testUser = {
  username: "Laurin",
  email: "test@test",
  password: "test",
}

//const user = client.auth.register.mutate({
//  username: testUser.username,
//  email: testUser.email,
//  password: testUser.password,
//})
//
//
const main = async () => {
  const user = await client.auth.login.query({
    email: testUser.email,
    password: testUser.password
  })
  console.log(user)
}


main()
