import { app } from "./server/server"
const port = 3000;

const bootstrap = async () => {
  app.listen(port, () => {
    console.log(`Server is running on: localhost:${port}`)
  })
}

bootstrap()
