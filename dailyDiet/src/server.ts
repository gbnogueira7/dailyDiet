import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
const app = fastify()

app.get('/', async () => {
  const userTable = await knex('users').select('*')

  return userTable
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running 🚀')
  })
