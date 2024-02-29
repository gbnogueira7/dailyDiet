import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { authenticate } from '../middleware/token-authenticate'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/getAll', { preHandler: [authenticate] }, async (req, res) => {
    try {
      const getAllUsers = await knex('users').select('*')
      return getAllUsers
    } catch (error) {
      res.status(500).send({ error: 'Erro ao obter usuários' })
    }
  })

  app.post('/create', async (req) => {
    const userBodySchema = z.object({
      userName: z.string(),
      password: z.string(),
    })

    try {
      const { userName, password } = userBodySchema.parse(req.body)
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
