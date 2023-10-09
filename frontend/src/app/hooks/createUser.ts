import { tClient } from "../trpc/client"

export const createUser = async () => {
  const user = await tClient.client.user.createUser.mutate({
    username: "Test",
    password: "test",
    email: "test@test"
  })

  console.log(user)
  console.log("Hello")
}
