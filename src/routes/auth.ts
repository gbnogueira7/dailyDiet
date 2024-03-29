import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function authRoute(app: FastifyInstance) {
  app.get('/', async (req, res) => {
    console.log('Welcome')
    res.send('Welcome')
  })
  app.post('/', async (req, reply) => {
    const userBodySchema = z.object({
      userName: z.string(),
      password: z.string(),
    })

    const { userName, password } = userBodySchema.parse(req.body)

    try {
      const user = await knex('users').where({ userName }).first()
      if (!user) {
        return reply.status(401).send({
          error: 'Usuário não encontrado',
        })
      }

      // Verifica a senha - isso deve ser feito de maneira mais segura, como usando bcrypt
      if (user.password !== password) {
        return reply.status(401).send({
          error: 'Usuário não encontrado',
        })
      }

      const id = user.id

      // Gera o token JWT
      const token = app.jwt.sign({ id })

      reply.send({ token })
    } catch (error) {
      reply.status(401).send({ error })
    }
  })
}
