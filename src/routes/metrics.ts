import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function metricsRoute(app: FastifyInstance) {
  app.get('/:id', async (req, res) => {
    const getIdSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getIdSchema.parse(req.params)
    const userId = id

    const mealsRegistred = await knex('meals').where({
      userId,
    })

    let currentSequenceLength = 0
    let longestSequenceLength = 0

    // for ... of: basicamente ele pega cada elemento de mealsRegistred
    // e chama de meal, ele separa em elementos de um array

    for (const meal of mealsRegistred) {
      // se o elemento tem inDiet=true
      if (meal.inDiet) {
        // soma +1 a currentSequenceLength
        currentSequenceLength++
        // Essencialmente, essa linha de código compara o comprimento da sequência atual (currentSequenceLength) com o comprimento da maior sequência já registrada (longestSequenceLength). O resultado da comparação é atribuído a longestSequenceLength, mantendo o maior valor entre os dois.
        longestSequenceLength = Math.max(
          longestSequenceLength,
          currentSequenceLength,
        )
      } else {
        currentSequenceLength = 0
      }
    }

    const mealsRegistredInDiet = await knex('meals').where({
      userId,
      inDiet: true,
    })
    const mealsRegistredNotInDiet = await knex('meals').where({
      userId,
      inDiet: false,
    })
    const mealsRegistredLenght = mealsRegistred.length

    const mealsRegistredInDietLenght = mealsRegistredInDiet.length

    const mealsRegistredNotInDietLenght = mealsRegistredNotInDiet.length

    const metricsObject = {
      mealsRegistredLenght,
      mealsRegistredInDietLenght,
      mealsRegistredNotInDietLenght,
      longestSequenceLength,
    }
    return res.status(200).send(metricsObject)
  })
}
