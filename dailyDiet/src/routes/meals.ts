import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/token-authenticate'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/allMeals', { preHandler: [authenticate] }, async (req, res) => {
    try {
      const getAllMeals = await knex('meals').select('*')
      return getAllMeals
    } catch (error) {
      res.status(500).send({ error: 'Erro ao obter refeições' })
    }
  })
}
