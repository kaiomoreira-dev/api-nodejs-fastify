import { FastifyRequest } from 'fastify'

export async function logAcessTransaction(request: FastifyRequest) {
  console.log(`[${request.method}] - ${request.url}`)
}
