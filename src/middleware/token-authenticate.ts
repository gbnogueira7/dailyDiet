import { FastifyRequest, FastifyReply } from 'fastify'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.jwtVerify() // Verifica se o token é válido

  if (!token) {
    return reply.status(401).send({
      error: 'Unauthenticated',
    })
  }
}
