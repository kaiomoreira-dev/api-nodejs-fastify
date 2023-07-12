import { env } from './env'
import { app } from './app'

app.listen({ host: '0.0.0.0', port: env.PORT }).then(() => {
  console.log('Listening on port 3333')
})
