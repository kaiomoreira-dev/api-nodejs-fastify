import { env } from './env'
import { app } from './app'

app.listen({ port: env.PORT }).then(() => {
  console.log('Listening on port 3333')
})
