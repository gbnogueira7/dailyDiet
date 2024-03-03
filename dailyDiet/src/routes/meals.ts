import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/token-authenticate'
import { knex } from '../database'
import { z } from 'zod'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  interface DecodedToken extends JwtPayload {
    id: string // ou o tipo apropriado para o ID do usuário
  }
  app.get('/getAll', { preHandler: [authenticate] }, async (req, res) => {
    // está fazendo uma requisição no authorization do headers
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      // Se o cabeçalho de autorização não começar com 'Bearer ', retorne um erro
      return res
        .status(401)
        .send({ error: 'Token de acesso ausente ou inválido' })
    }
    // Extraia o token removendo 'Bearer '
    const token = authorizationHeader.substring(7)

    // Decodifique o token
    const decoded: DecodedToken = jwtDecode(token)

    // Agora você pode acessar as informações do usuário
    const userId = decoded.id

    const getAllMeals = await knex('meals').where('userId', userId).select('*')
    return getAllMeals
  })
  app.post('/create', { preHandler: [authenticate] }, async (req, res) => {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      // Se o cabeçalho de autorização não começar com 'Bearer ', retorne um erro
      return res
        .status(401)
        .send({ error: 'Token de acesso ausente ou inválido' })
    }

    // Extraia o token removendo 'Bearer '
    const token = authorizationHeader.substring(7)

    // Decodifique o token
    const decoded: DecodedToken = jwtDecode(token)

    // Agora você pode acessar as informações do usuário

    const idUser = decoded.id

    const mealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inDiet: z.boolean(),
    })

    const { name, description, inDiet } = mealBodySchema.parse(req.body)
    // Inserir a refeição no banco de dados
    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      inDiet,
      created_at: new Date(),
      userId: idUser,
    })

    // Recuperar os dados da refeição inserida

    // Retornar os dados da refeição inserida
    return res.status(201).send('refeição registrada')
  })
  app.get('/:id', { preHandler: [authenticate] }, async (req, res) => {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      // Se o cabeçalho de autorização não começar com 'Bearer ', retorne um erro
      return res
        .status(401)
        .send({ error: 'Token de acesso ausente ou inválido' })
    }

    const token = authorizationHeader.substring(7)
    const decoded: DecodedToken = jwtDecode(token)

    const getIdSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getIdSchema.parse(req.params)
    const meal = await knex('meals').where({
      id,
      userId: decoded.id,
    })

    return meal
  })
  app.put('/:id/alter', { preHandler: [authenticate] }, async (req, res) => {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      // Se o cabeçalho de autorização não começar com 'Bearer ', retorne um erro
      return res
        .status(401)
        .send({ error: 'Token de acesso ausente ou inválido' })
    }

    const token = authorizationHeader.substring(7)
    const decoded: DecodedToken = jwtDecode(token)

    const getIdSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getIdSchema.parse(req.params)
    try {
      const mealToAlter = await knex('meals')
        .where({ id, userId: decoded.id })
        .first()

      if (!mealToAlter) {
        return res.status(404).send({ error: 'Refeição não encontrada' })
      }

      const mealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        inDiet: z.boolean(),
      })

      const { name, description, inDiet } = mealBodySchema.parse(req.body)

      await knex('meals').where({ id, userId: decoded.id }).update({
        name,
        description,
        inDiet,
      })

      return res
        .status(200)
        .send({ message: 'Refeição atualizada com sucesso' })
    } catch (error) {
      console.error('Erro ao atualizar refeição:', error)
      return res
        .status(500)
        .send({ error: 'Erro ao processar a atualização da refeição' })
    }
  })
}
