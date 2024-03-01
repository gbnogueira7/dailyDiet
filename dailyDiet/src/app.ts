import { fastify } from 'fastify'
import { usersRoutes } from './routes/users'
import { authRoute } from './routes/auth'
import fastifyJwt from '@fastify/jwt'
import { mealsRoutes } from './routes/meals'

export const app = fastify()

app.register(fastifyJwt, {
  secret: 'seu_segredo_super_secreto', // Substitua por uma chave secreta mais segura
})

app.register(usersRoutes, {
  prefix: '/users',
})
app.register(mealsRoutes, { prefix: '/meals' })
app.register(authRoute)
