import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/api/transactions')
      .send({
        description: 'Receive payments for 4code solutions',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/api/transactions')
      .send({
        description: 'Receive payments for 4code solutions',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)

    const cookie = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/api/transactions')
      .set('Cookie', cookie)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        description: 'Receive payments for 4code solutions',
        amount: 5000,
      }),
    ])
  })

  it('should be able to show specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/api/transactions')
      .send({
        description: 'Receive payments for 4code solutions',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)

    const cookie = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/api/transactions')
      .set('Cookie', cookie)
      .expect(200)

    const id = listTransactionsResponse.body.transactions[0].id

    const getTransactionsResponse = await request(app.server)
      .get(`/api/transactions/${id}`)
      .set('Cookie', cookie)
      .expect(200)

    expect(getTransactionsResponse.body.transaction).toEqual(
      expect.objectContaining({
        description: 'Receive payments for 4code solutions',
        amount: 5000,
      }),
    )
  })

  it('should be able to show summary for all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/api/transactions')
      .send({
        description: 'Receive payments for 4code solutions',
        amount: 5000,
        type: 'debit',
      })
      .expect(201)

    const cookie = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/api/transactions')
      .send({
        description: 'Payments for 4code solutions',
        amount: 6000,
        type: 'credit',
      })
      .set('Cookie', cookie)
      .expect(201)

    const getSummaryTransactionsResponse = await request(app.server)
      .get(`/api/transactions/summary`)
      .set('Cookie', cookie)
      .expect(200)

    expect(getSummaryTransactionsResponse.body.summary).toEqual(
      expect.objectContaining({
        amount: 1000,
      }),
    )
  })
})
