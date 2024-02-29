import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/getAll', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const getAllUsers = await knex('users').select('*')
      return getAllUsers
    } catch (error) {
      reply.status(500).send({ error: 'Erro ao obter usuários' })
    }
  })

  app.post('/create', async (request: FastifyRequest) => {
    const userBodySchema = z.object({
      userName: z.string(),
      password: z.string(),
    })

    try {
      const { userName, password } = userBodySchema.parse(request.body)
      const newUser = await knex('users').insert({
        id: randomUUID(),
        userName,
        password,
      })
      return newUser
    } catch (error) {
      return { error: 'Erro ao criar usuário' }
    }
  })
}
