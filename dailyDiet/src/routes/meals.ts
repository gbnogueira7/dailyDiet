import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/token-authenticate'
import { knex } from '../database'
import { z } from 'zod'
import { jwtDecode } from 'jwt-decode'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/allMeals', { preHandler: [authenticate] }, async (req, res) => {
    try {
      const getAllMeals = await knex('meals').select('*')
      return getAllMeals
    } catch (error) {
      res.status(500).send({ error: 'Erro ao obter refeições' })
    }
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
    console.log(token)

    // Decodifique o token
    const decoded = jwtDecode(token)

    if (!decoded) {
      return res
        .status(401)
        .send({ error: 'Token não contém informações do usuário' })
    }

    // Agora você pode acessar as informações do usuário
    const idUser = decoded

    console.log('ID do usuário:', idUser)

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
  // app.get('/', async (req, res) => {
  //   // Obtenha o token do cabeçalho de autorização
  //   const authorizationHeader = req.headers.authorization

  //   if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
  //     // Se o cabeçalho de autorização não começar com 'Bearer ', retorne um erro
  //     return res
  //       .status(401)
  //       .send({ error: 'Token de acesso ausente ou inválido' })
  //   }

  //   // Extraia o token removendo 'Bearer '
  //   const token = authorizationHeader.substring(7)
  //   console.log(token)

  //   try {
  //     // Decodifique o token
  //     const decoded = jwtDecode(token)

  //     if (!decoded) {
  //       return res
  //         .status(401)
  //         .send({ error: 'Token não contém informações do usuário' })
  //     }

  //     // Agora você pode acessar as informações do usuário
  //     const idUser = decoded

  //     console.log('ID do usuário:', idUser)

  //     res.send({ userId: idUser })
  //   } catch (error) {
  //     console.error('Erro durante a decodificação do token:', error)
  //     res.status(500).send({ error: 'Erro durante a decodificação do token' })
  //   }
  // })
}
