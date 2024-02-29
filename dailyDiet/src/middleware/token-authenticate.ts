import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

export async function authenticate(fastify: FastifyInstance) {
  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify() // Verifica se o token é válido
      } catch (err) {
        reply.status(401).send({ error: 'Token inválido ou ausente' })
      }
    },
  )
}
