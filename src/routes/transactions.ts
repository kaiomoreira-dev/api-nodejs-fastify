import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { checkSessionIdTransaction } from '../middlewares/check-session-id-transaction'
import { logAcessTransaction } from '../middlewares/log-acess.transaction'

export async function transactionsRoutes(app: FastifyInstance) {
  // middleware global dentro de um plugin apenas
  // caso quissemos que fosse global dentro do fastify teriamos que importar
  // dentro do server direto antes das rotas
  app.addHook('preHandler', logAcessTransaction)

  app.post('/', async (request, reply) => {
    const createTransactionSchema = z.object({
      description: z.string(),
      amount: z.number(),
      type: z.enum(['debit', 'credit']),
    })
    const { amount, description, type } = createTransactionSchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
      })
    }

    await knex('transaction').insert({
      id: randomUUID(),
      description,
      amount: type === 'credit' ? amount : amount * -1,
      sessionId,
    })

    return reply.status(201).send()
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdTransaction],
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const transactions = await knex('transaction')
        .where({
          sessionId,
        })
        .select()

      return reply.status(200).send({ transactions })
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdTransaction],
    },
    async (request, reply) => {
      const idTransactionParams = z.object({
        id: z.string().uuid(),
      })

      const { id } = idTransactionParams.parse(request.params)

      const sessionId = request.cookies.sessionId

      const transaction = await knex('transaction')
        .where({
          id,
          sessionId,
        })
        .select()
        .first()

      return reply.status(200).send({ transaction })
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdTransaction],
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId
      const summary = await knex('transaction')
        .where({
          sessionId,
        })
        .sum('amount', {
          as: 'amount',
        })
        .first()

      return reply.status(200).send({ summary })
    },
  )
}
