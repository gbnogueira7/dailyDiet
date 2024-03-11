import { fastify } from 'fastify'
import { usersRoutes } from './routes/users'
import { authRoute } from './routes/auth'
import fastifyJwt from '@fastify/jwt'
import { mealsRoutes } from './routes/meals'
import { metricsRoute } from './routes/metrics'
import { env } from './env'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET, // Substitua por uma chave secreta mais segura
})

app.register(usersRoutes, {
  prefix: '/users',
})
app.register(mealsRoutes, { prefix: '/meals' })
app.register(authRoute)
app.register(metricsRoute, { prefix: '/metrics' })
